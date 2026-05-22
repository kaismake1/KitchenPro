from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import stripe
from backend.db import get_db
from backend.models.orm import Order, OrderItem, Product, User
from backend.services.auth import verify_token
from backend.services.search import decrement_stock
from backend.services.payment import create_payment_intent, verify_webhook_signature
from backend.services.shipper import assign_shipper_to_order

router = APIRouter(prefix="/api/checkout", tags=["checkout"])


class CartItem(BaseModel):
    productId: int
    quantity: int


class ShippingInfo(BaseModel):
    fullName: str
    phone: str
    address: str


class CheckoutRequest(BaseModel):
    cart: List[CartItem]
    shippingInfo: ShippingInfo
    paymentMethod: str  # "stripe", "cod", "qr"


class CheckoutResponse(BaseModel):
    orderId: str
    redirect_url: Optional[str] = None  # For payment gateway redirect
    total: float
    status: str


@router.post("/", response_model=CheckoutResponse)
def checkout(req: CheckoutRequest, authorization: str = Header(None), db: Session = Depends(get_db)):
    """
    Create order and initiate payment.
    - Supports both authenticated users and guest checkout
    - If paymentMethod is "stripe", returns redirect_url to payment gateway.
    - If "cod" or "qr", returns orderId directly.
    """
    try:
        # Get user ID if authenticated, otherwise None for guest checkout
        user_id = None
        user = None
        
        if authorization:
            # Parse "Bearer {token}" format
            try:
                scheme, token = authorization.split()
                if scheme.lower() == "bearer":
                    payload = verify_token(token)
                    if payload:
                        user_id = payload.get("sub")
                        user = db.query(User).filter(User.id == user_id).first()
            except (ValueError, AttributeError):
                pass  # Continue with guest checkout

        # Validate cart and calculate total
        total = 0.0
        order_items_data = []

        for item in req.cart:
            product = db.query(Product).filter(Product.id == item.productId).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.productId} not found")
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Insufficient stock for {product.name}"
                )
            
            line_total = product.price * item.quantity
            total += line_total
            order_items_data.append({
                "product": product,
                "quantity": item.quantity,
                "price": product.price,
            })

        # Create order
        order = Order(
            user_id=user_id,  # None for guest orders
            total=total,
            payment_method=req.paymentMethod,
            shipping_info=req.shippingInfo.dict(),
            status="pending",
        )

        # Add order items
        for item_data in order_items_data:
            order_item = OrderItem(
                order=order,
                product_id=item_data["product"].id,
                quantity=item_data["quantity"],
                price=item_data["price"],
            )
            db.add(order_item)

        db.add(order)
        db.commit()
        db.refresh(order)

        # Auto-assign shipper to the order
        assign_shipper_to_order(db, order.id)
        
        # Refresh order after assignment
        db.refresh(order)
        print(f"Order {order.id} assigned to shipper: {order.shipper_id}")

        # Handle payment method
        redirect_url = None
        if req.paymentMethod == "stripe":
            # Create Stripe payment intent
            amount_cents = int(total * 100)  # Convert to cents
            description = f"Order {order.id}"
            if user:
                description += f" from {user.username}"
            else:
                description += f" from {req.shippingInfo.fullName}"
            
            result = create_payment_intent(
                amount=amount_cents,
                description=description
            )
            if result:
                order.stripe_payment_intent_id = result["id"]
                db.commit()
                redirect_url = f"https://checkout.stripe.com?payment_intent={result['client_secret']}"

        return CheckoutResponse(
            orderId=order.id,
            redirect_url=redirect_url,
            total=total,
            status=order.status,
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Checkout error: {str(e)}")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint for Stripe payment confirmation.
    Called by Stripe when payment succeeds/fails.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    # Verify signature
    event = verify_webhook_signature(payload, sig_header)
    if not event:
        return {"status": "signature_verification_failed"}

    # Handle payment_intent.succeeded
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        
        # Find order by payment intent ID
        order = db.query(Order).filter(
            Order.stripe_payment_intent_id == payment_intent["id"]
        ).first()

        if order:
            # Decrement stock for each item
            for item in order.items:
                decrement_stock(db, item.product_id, item.quantity)

            # Mark order as paid
            order.status = "paid"
            db.commit()

    return {"status": "received"}


@router.get("/{order_id}")
def get_order(order_id: str, authorization: str = Header(None), db: Session = Depends(get_db)):
    """Get order details."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Parse "Bearer {token}" format
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    # Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    order = db.query(Order).filter(
        (Order.id == order_id) & (Order.user_id == user.id)
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "id": order.id,
        "status": order.status,
        "total": order.total,
        "paymentMethod": order.payment_method,
        "shippingInfo": order.shipping_info,
        "items": [
            {
                "productId": item.product_id,
                "name": item.product.name,
                "quantity": item.quantity,
                "price": item.price,
            }
            for item in order.items
        ],
        "createdAt": order.created_at.isoformat(),
    }


@router.get("/user/history")
def get_order_history(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Get current user's order history."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Parse "Bearer {token}" format
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    # Verify token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    orders = db.query(Order).filter(Order.user_id == user.id).all()

    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "status": order.status,
            "total": order.total,
            "paymentMethod": order.payment_method,
            "createdAt": order.created_at.isoformat(),
            "itemCount": len(order.items),
            "shipper": order.shipper or "",
            "shipperPhone": order.shipper_phone or "",
        })

    return result
