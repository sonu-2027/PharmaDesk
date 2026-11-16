"""PharmaDesk tables. Uses its own Base and 'pharma_' table names so it never clashes with your db_models.py."""
from datetime import date, datetime
from sqlalchemy import String, Integer, Numeric, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "pharma_users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    pharmacy_name: Mapped[str] = mapped_column(String(150))
    license_no: Mapped[str] = mapped_column(String(60))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(100))
    low_stock_limit: Mapped[int] = mapped_column(Integer, default=20)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)


class Medicine(Base):
    __tablename__ = "pharma_medicines"
    __table_args__ = (UniqueConstraint("owner_id", "code", name="uq_medicine_owner_code"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("pharma_users.id"), index=True)
    code: Mapped[str] = mapped_column(String(64))          # barcode / product code
    name: Mapped[str] = mapped_column(String(150))
    brand: Mapped[str] = mapped_column(String(100))
    qty: Mapped[int] = mapped_column(Integer, default=0)
    mfg: Mapped[date] = mapped_column(Date)
    exp: Mapped[date] = mapped_column(Date)
    price: Mapped[float] = mapped_column(Numeric(10, 2))


class Order(Base):
    __tablename__ = "pharma_orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("pharma_users.id"), index=True)
    supplier: Mapped[str] = mapped_column(String(150))
    items: Mapped[int] = mapped_column(Integer)
    total: Mapped[float] = mapped_column(Numeric(12, 2))
    status: Mapped[str] = mapped_column(String(20), default="Pending")  # Pending / Shipped / Delivered
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)


class Invoice(Base):
    __tablename__ = "pharma_invoices"
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("pharma_users.id"), index=True)
    customer: Mapped[str] = mapped_column(String(150), default="")
    total: Mapped[float] = mapped_column(Numeric(12, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    lines: Mapped[list["InvoiceItem"]] = relationship(cascade="all, delete-orphan")


class InvoiceItem(Base):
    __tablename__ = "pharma_invoice_items"
    id: Mapped[int] = mapped_column(primary_key=True)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("pharma_invoices.id"))
    medicine_id: Mapped[int | None] = mapped_column(ForeignKey("pharma_medicines.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(150))         # copied at sale time so old invoices stay correct
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    qty: Mapped[int] = mapped_column(Integer)
