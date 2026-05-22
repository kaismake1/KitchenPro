from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from backend.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # user, admin, or shipper
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = relationship("Order", back_populates="user", foreign_keys="Order.user_id", cascade="all, delete-orphan")
    shipped_orders = relationship("Order", back_populates="assigned_shipper", foreign_keys="Order.shipper_id")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    status = Column(String, default="in-stock", nullable=False)  # in-stock, out-of-stock, coming-soon
    rating = Column(Float, default=4.5)
    reviews = Column(Integer, default=0)
    badge = Column(String, nullable=True)  # "Bán Chạy Nhất", "Mới", etc.

    # Attributes (JSON: e.g., {"power": 3000, "zones": 4})
    attributes = Column(JSON, default={}, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="images")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)  # nullable for guest orders
    shipper_id = Column(String, ForeignKey("users.id"), nullable=True)  # nullable until assigned by admin
    status = Column(String, default="pending", nullable=False)  # pending, paid, shipped, delivered, cancelled
    total = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)  # qr, cod, stripe, etc.
    stripe_payment_intent_id = Column(String, nullable=True, unique=True)

    # Shipping info
    shipping_info = Column(JSON, nullable=False)
    shipper = Column(String, default="John Express Delivery")
    shipper_phone = Column(String, nullable=True)  # Shipper phone number

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders", foreign_keys=[user_id], lazy="select")
    assigned_shipper = relationship("User", back_populates="shipped_orders", foreign_keys=[shipper_id], lazy="select")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # price at time of order

    product = relationship("Product", back_populates="order_items")
    order = relationship("Order", back_populates="items")
