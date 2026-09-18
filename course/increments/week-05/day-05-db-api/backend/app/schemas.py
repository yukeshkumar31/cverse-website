from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


Role = Literal["customer", "staff"]
BookingStatus = Literal["booked", "in_progress", "completed"]


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1, max_length=120)
    role: Role = "customer"


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


class BikeCreate(BaseModel):
    make: str = Field(min_length=1, max_length=80)
    model: str = Field(min_length=1, max_length=80)
    registration_number: str = Field(min_length=1, max_length=40)


class BikeUpdate(BaseModel):
    make: Optional[str] = Field(default=None, min_length=1, max_length=80)
    model: Optional[str] = Field(default=None, min_length=1, max_length=80)
    registration_number: Optional[str] = Field(default=None, min_length=1, max_length=40)


class BikeOut(BaseModel):
    id: int
    owner_id: int
    make: str
    model: str
    registration_number: str
    created_at: datetime

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    bike_id: int
    service_type: str = Field(min_length=1, max_length=120)
    notes: Optional[str] = None


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingOut(BaseModel):
    id: int
    customer_id: int
    bike_id: int
    service_type: str
    status: BookingStatus
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    bike_registration: Optional[str] = None

    class Config:
        from_attributes = True
