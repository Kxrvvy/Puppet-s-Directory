from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    item_name: str
    desciption: str
    base_price: float
    category: str
    image_url: Optional[str] = None
    status: Optional[str] = "active"
    
class ProductUpdate(BaseModel):
    item_name: Optional[str] = None
    desciption: Optional[str] = None
    base_price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    
class ProductResponse(BaseModel):
    product_id: int
    item_name: str
    base_price: float
    category: str
    image_url: Optional[str] = None
    status: str # ask why it is also put in product_variant and not product
    created_at: datetime #ask if need to add
    
    class Config:
        form_attribute = True