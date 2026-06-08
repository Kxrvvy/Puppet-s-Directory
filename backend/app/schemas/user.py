from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    
class UserResponse(BaseModel):
    message: Optional[str] = None
    user_id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime
    
    class COnfig:
        form_attribute = True
        
