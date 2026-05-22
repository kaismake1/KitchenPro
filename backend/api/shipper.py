from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from backend.db import get_db
from backend.models.orm import Order, OrderItem, User
from backend.services.auth import verify_token

router = APIRouter(prefix="/api/shipper", tags=["shipper"])


class OrderItemResponse(BaseModel):
    productId: int
    name: str
    quantity: int
    price: float


class OrderResponse(BaseModel):
    id: str
    status: str
    total: float
    paymentMethod: str
    shippingInfo: dict
    items: List[OrderItemResponse]
    createdAt: str
    updatedAt: str


class UpdateOrderStatusRequest(BaseModel):
    status: str  # "delivered", "cancelled"


@router.get("/orders", response_model=List[OrderResponse])
def get_shipper_orders(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Get all orders assigned to the logged-in shipper."""
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
    
    shipper_id = payload.get("sub")
    shipper = db.query(User).filter(User.id == shipper_id).first()
    if not shipper:
        raise HTTPException(status_code=401, detail="User not found")
    
    if shipper.role != "shipper":
        raise HTTPException(status_code=403, detail="Only shippers can access this endpoint")
    
    # Get all orders assigned to this shipper
    orders = db.query(Order).filter(Order.shipper_id == shipper_id).all()
    
    result = []
    for order in orders:
        result.append({
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
            "updatedAt": order.updated_at.isoformat(),
        })
    
    return result


@router.patch("/{order_id}/status", response_model=dict)
def update_order_status(
    order_id: str,
    req: UpdateOrderStatusRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Update order status. Only the assigned shipper can update their orders.
    Allowed statuses: "delivered", "cancelled"
    """
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
    
    shipper_id = payload.get("sub")
    shipper = db.query(User).filter(User.id == shipper_id).first()
    if not shipper:
        raise HTTPException(status_code=401, detail="User not found")
    
    if shipper.role != "shipper":
        raise HTTPException(status_code=403, detail="Only shippers can update order status")
    
    # Get the order
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if this order is assigned to this shipper
    if order.shipper_id != shipper_id:
        raise HTTPException(status_code=403, detail="This order is not assigned to you")
    
    # Validate status
    valid_statuses = ["delivered", "cancelled"]
    if req.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {', '.join(valid_statuses)}"
        )
    
    # Update status
    old_status = order.status
    order.status = req.status
    db.commit()
    db.refresh(order)
    
    return {
        "orderId": order.id,
        "previousStatus": old_status,
        "newStatus": order.status,
        "message": f"Order status updated from {old_status} to {req.status}"
    }


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(
    order_id: str,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific order assigned to the shipper."""
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
    
    shipper_id = payload.get("sub")
    shipper = db.query(User).filter(User.id == shipper_id).first()
    if not shipper:
        raise HTTPException(status_code=401, detail="User not found")
    
    if shipper.role != "shipper":
        raise HTTPException(status_code=403, detail="Only shippers can access this endpoint")
    
    # Get the order
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if this order is assigned to this shipper
    if order.shipper_id != shipper_id:
        raise HTTPException(status_code=403, detail="This order is not assigned to you")
    
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
        "updatedAt": order.updated_at.isoformat(),
    }
