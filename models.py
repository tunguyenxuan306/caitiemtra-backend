from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)
    role = Column(String(50), default="staff")  # admin or staff

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String(500))
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    items = Column(JSON, nullable=False)  # [{id:1, qty:2}, ...]
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    payment_method = Column(String(50))  # cash or transfer
    transfer_code = Column(String(200))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BillTemplate(Base):
    __tablename__ = "bill_template"
    id = Column(Integer, primary_key=True)
    template_html = Column(String)
    template_css = Column(String)
