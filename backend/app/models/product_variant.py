from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.sql import func


class ProductVariant(Base):
    __tablename__ = "product_variants"
    
    variant_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    size = Column(String(50), nullable=False)
    color = Column(String(50), nullable=False)
    stock_threshold = Column(Integer, nullable=False)
    quantity_in_stock = Column(Integer, nullable=False)
    
    
    product = relationship("Product", back_populates="product_variants")
    restock_history = relationship("RestockHistory", back_populates="product_variant")
    sales_invoices = relationship("SalesInvoice", back_populates="product_variant")