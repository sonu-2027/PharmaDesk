from datetime import date
from typing import Literal
from pydantic import BaseModel, EmailStr, Field, model_validator


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    pharmacy: str = Field(min_length=1, max_length=150)
    license: str = Field(min_length=1, max_length=60)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)   # bcrypt only reads the first 72 bytes


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(max_length=72)


class ProfileIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    pharmacy: str = Field(min_length=1, max_length=150)
    low_stock_limit: int = Field(ge=1, le=10000)


class UserOut(BaseModel):
    name: str
    pharmacy: str
    license: str
    email: str
    low_stock_limit: int


class TokenOut(BaseModel):
    token: str
    user: UserOut


class MedicineIn(BaseModel):
    code: str = Field(min_length=1, max_length=64)
    name: str = Field(min_length=1, max_length=150)
    brand: str = Field(min_length=1, max_length=100)
    qty: int = Field(ge=0)
    mfg: date
    exp: date
    price: float = Field(ge=0)

    @model_validator(mode="after")
    def dates_in_order(self):
        if self.exp <= self.mfg:
            raise ValueError("Expiry date must be after the manufactured date")
        return self


class MedicineOut(BaseModel):
    id: int
    code: str
    name: str
    brand: str
    qty: int
    mfg: date
    exp: date
    price: float
    status: Literal["ok", "low", "out", "expired"]


class OrderIn(BaseModel):
    supplier: str = Field(min_length=1, max_length=150)
    items: int = Field(ge=1)
    total: float = Field(ge=0)


class OrderStatusIn(BaseModel):
    status: Literal["Pending", "Shipped", "Delivered"]


class OrderOut(BaseModel):
    id: str
    supplier: str
    items: int
    total: float
    date: date
    status: str


class InvoiceLineIn(BaseModel):
    medicine_id: int
    qty: int = Field(gt=0)


class InvoiceIn(BaseModel):
    customer: str = Field(default="", max_length=150)
    items: list[InvoiceLineIn] = Field(min_length=1)


class InvoiceOut(BaseModel):
    id: int
    customer: str
    total: float
    date: date


class DayTotal(BaseModel):
    d: str
    v: float


class DashboardOut(BaseModel):
    week_sales: list[DayTotal]
    week_total: float
    out: list[MedicineOut]
    expired: list[MedicineOut]
    low: list[MedicineOut]
    healthy_pct: int
    in_date_pct: int
    delivered_pct: int
