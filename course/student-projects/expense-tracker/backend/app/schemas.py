from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


Role = Literal["member", "admin"]
ExpenseStatus = Literal["recorded", "reviewed", "closed"]


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1, max_length=120)
    role: Role = "member"


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Role

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=80)
    description: Optional[str] = None


class CategoryOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    category_id: int
    title: str = Field(min_length=1, max_length=120)
    amount: Decimal = Field(gt=0, decimal_places=2)
    notes: Optional[str] = None


class ExpenseUpdate(BaseModel):
    category_id: Optional[int] = None
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    amount: Optional[Decimal] = Field(default=None, gt=0, decimal_places=2)
    notes: Optional[str] = None


class ExpenseStatusUpdate(BaseModel):
    status: ExpenseStatus


class ExpenseOut(BaseModel):
    id: int
    user_id: int
    category_id: int
    title: str
    amount: Decimal
    status: ExpenseStatus
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    category_name: Optional[str] = None

    class Config:
        from_attributes = True
