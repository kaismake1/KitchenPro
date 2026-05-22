from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import cloudinary
import cloudinary.uploader
from backend.db import get_db
from backend.models.orm import Product, ProductImage, User, Order
from backend.services.auth import verify_token, hash_password
from backend.config import (
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
)

# Configure Cloudinary
if CLOUDINARY_CLOUD_NAME:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
    )

router = APIRouter(prefix="/api/admin", tags=["admin"])


def verify_admin(authorization: str, db: Session) -> User:
    """Verify user is admin."""
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
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return user


@router.post("/products/{product_id}/images")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Upload product image to Cloudinary.
    Requires admin role.
    """
    admin = verify_admin(authorization, db)

    # Check product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Upload to Cloudinary
    try:
        contents = await file.read()
        result = cloudinary.uploader.upload(
            contents,
            folder=f"products/{product_id}",
            resource_type="auto",
            transformation=[
                {"quality": "auto", "fetch_format": "auto"},  # Auto optimize
                {"width": 1280, "crop": "fit"},  # Max 1280px width
            ]
        )
        image_url = result["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # Save to DB
    product_image = ProductImage(
        product_id=product_id,
        image_url=image_url,
        is_primary=(len(product.images) == 0),  # First image is primary
        order=len(product.images),
    )
    db.add(product_image)
    db.commit()
    db.refresh(product_image)

    return {
        "id": product_image.id,
        "url": product_image.image_url,
        "is_primary": product_image.is_primary,
    }


class ProductCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    brand: Optional[str] = None
    stock: int
    attributes: dict = {}
    rating: float = 4.5
    reviews: int = 0
    badge: Optional[str] = None


@router.post("/products")
def create_product(
    req: ProductCreateRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Create new product."""
    admin = verify_admin(authorization, db)

    product = Product(
        name=req.name,
        description=req.description,
        price=req.price,
        category=req.category,
        brand=req.brand,
        stock=req.stock,
        attributes=req.attributes,
        rating=req.rating,
        reviews=req.reviews,
        badge=req.badge,
        status="in-stock" if req.stock > 0 else "out-of-stock",
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
        "status": product.status,
    }


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    badge: Optional[str] = None
    attributes: Optional[dict] = None


@router.patch("/products/{product_id}")
def update_product(
    product_id: int,
    req: ProductUpdateRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Update product."""
    admin = verify_admin(authorization, db)

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if req.name:
        product.name = req.name
    if req.description:
        product.description = req.description
    if req.price:
        product.price = req.price
    if req.stock is not None:
        product.stock = req.stock
        product.status = "in-stock" if req.stock > 0 else "out-of-stock"
    if req.badge is not None:
        product.badge = req.badge
    if req.attributes:
        product.attributes = req.attributes

    db.commit()
    db.refresh(product)

    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
        "status": product.status,
    }


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Delete product."""
    admin = verify_admin(authorization, db)

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"status": "deleted"}


@router.get("/orders")
def get_all_orders(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Get all orders for admin dashboard."""
    admin = verify_admin(authorization, db)

    orders = db.query(Order).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "userId": order.user_id,
            "status": order.status,
            "total": order.total,
            "paymentMethod": order.payment_method,
            "createdAt": order.created_at.isoformat(),
            "shippingInfo": order.shipping_info,
            "shipper": order.shipper,
            "shipper_phone": order.shipper_phone,
            "items": [
                {
                    "productId": item.product_id,
                    "name": item.product.name,
                    "quantity": item.quantity,
                    "price": item.price,
                }
                for item in order.items
            ],
        })

    return result


class OrderStatusUpdate(BaseModel):
    status: Optional[str] = None
    shipper: Optional[str] = None
    shipper_phone: Optional[str] = None


def update_product_stock(db: Session, order: Order, old_status: str, new_status: str):
    """
    Update product stock based on order status changes.
    
    Logic:
    - "pending" -> "paid" or "shipping": Deduct stock
    - "shipping" -> "cancelled": Return stock
    - "cancelled" -> any other status: Deduct stock (order reinstated)
    - "paid"/"shipping" -> "cancelled": Return stock
    """
    # Statuses that reserve stock (products are no longer available)
    RESERVED_STATUSES = {"paid", "shipping", "delivered"}
    
    is_old_reserved = old_status in RESERVED_STATUSES
    is_new_reserved = new_status in RESERVED_STATUSES
    
    # Deduct stock: transitioning to a reserved status from non-reserved
    if not is_old_reserved and is_new_reserved:
        for item in order.items:
            product = item.product
            product.stock -= item.quantity
            product.status = "in-stock" if product.stock > 0 else "out-of-stock"
        db.commit()
    
    # Return stock: transitioning from reserved to non-reserved (e.g., cancelled)
    elif is_old_reserved and not is_new_reserved:
        for item in order.items:
            product = item.product
            product.stock += item.quantity
            product.status = "in-stock"
        db.commit()


@router.patch("/orders/{order_id}")
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Update order status, shipper info - for admin dashboard sync.
    Automatically manages product stock based on order status.
    """
    admin = verify_admin(authorization, db)

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    
    # Update fields if provided
    if status_update.status:
        order.status = status_update.status
        # Update product stock when status changes
        update_product_stock(db, order, old_status, status_update.status)
    
    if status_update.shipper:
        order.shipper = status_update.shipper
    if status_update.shipper_phone:
        order.shipper_phone = status_update.shipper_phone
    
    db.commit()
    db.refresh(order)

    return {
        "id": order.id,
        "status": order.status,
        "shipper": order.shipper,
        "shipper_phone": order.shipper_phone,
        "message": "Order updated successfully"
    }


@router.delete("/orders/{order_id}")
def delete_order(
    order_id: str,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Delete an order - for admin dashboard."""
    admin = verify_admin(authorization, db)

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Delete order (cascade will delete order items)
    db.delete(order)
    db.commit()

    return {
        "id": order_id,
        "message": "Order deleted successfully"
    }


class AssignShipperRequest(BaseModel):
    shipper_id: str


@router.post("/orders/{order_id}/assign-shipper")
def assign_shipper_to_order(
    order_id: str,
    req: AssignShipperRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Assign a shipper to an order - for admin dashboard."""
    admin = verify_admin(authorization, db)

    # Check order exists
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check shipper exists and has shipper role
    shipper = db.query(User).filter(User.id == req.shipper_id).first()
    if not shipper:
        raise HTTPException(status_code=404, detail="Shipper not found")
    
    if shipper.role != "shipper":
        raise HTTPException(status_code=400, detail="User is not a shipper")

    # Assign shipper to order
    order.shipper_id = req.shipper_id
    order.shipper = shipper.username  # Update shipper name for reference
    db.commit()
    db.refresh(order)

    return {
        "id": order.id,
        "shipper_id": order.shipper_id,
        "shipper_name": order.shipper,
        "message": "Shipper assigned successfully"
    }


@router.get("/users")
def get_all_users(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Get all users for admin dashboard."""
    admin = verify_admin(authorization, db)

    users = db.query(User).all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "phone": user.phone,
            "address": user.address,
            "status": "active",
        })

    return result


class UserCreateRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"
    phone: Optional[str] = None
    address: Optional[str] = None


@router.post("/users")
def create_user(
    req: UserCreateRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Create new user - for admin dashboard."""
    admin = verify_admin(authorization, db)

    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == req.username) | (User.email == req.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Create new user
    hashed_pw = hash_password(req.password)
    new_user = User(
        username=req.username,
        email=req.email,
        hashed_password=hashed_pw,
        role=req.role,
        phone=req.phone,
        address=req.address
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role,
        "phone": new_user.phone,
        "address": new_user.address,
        "status": "active"
    }


class UserUpdateRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    req: UserUpdateRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Update user - for admin dashboard."""
    admin = verify_admin(authorization, db)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields if provided
    if req.username is not None:
        user.username = req.username
    if req.email is not None:
        user.email = req.email
    if req.role is not None:
        user.role = req.role
    if req.phone is not None:
        user.phone = req.phone
    if req.address is not None:
        user.address = req.address

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
        "address": user.address,
        "status": "active"
    }
