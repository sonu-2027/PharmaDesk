"""PharmaDesk API.  Run:  uvicorn pharma_main:app --reload   (docs at http://localhost:8000/docs)"""
from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import pharma_schemas as s
from auth import create_token, current_user, get_db, hash_password, verify_password
from database import engine
from pharma_models import Base, Invoice, InvoiceItem, Medicine, Order, User

Base.metadata.create_all(bind=engine)   # creates the pharma_* tables in PostgreSQL if missing

app = FastAPI(title="PharmaDesk API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])
api = APIRouter(prefix="/api")


# ---------- helpers ----------
def status_of(m: Medicine, limit: int) -> str:
    if m.exp < date.today():
        return "expired"
    if m.qty == 0:
        return "out"
    return "low" if m.qty <= limit else "ok"


def med_out(m: Medicine, limit: int) -> dict:
    return dict(id=m.id, code=m.code, name=m.name, brand=m.brand, qty=m.qty, mfg=m.mfg,
                exp=m.exp, price=float(m.price), status=status_of(m, limit))


def user_out(u: User) -> dict:
    return dict(name=u.name, pharmacy=u.pharmacy_name, license=u.license_no, email=u.email, low_stock_limit=u.low_stock_limit)


def order_out(o: Order) -> dict:
    return dict(id=f"ORD-{1000 + o.id}", supplier=o.supplier, items=o.items, total=float(o.total),
                date=o.created_at.date(), status=o.status)


def own_medicine(db: Session, user: User, med_id: int) -> Medicine:
    m = db.get(Medicine, med_id)
    if not m or m.owner_id != user.id:     # never reveal other pharmacies' data
        raise HTTPException(404, "Medicine not found")
    return m


# ---------- auth ----------
@api.post("/auth/register", response_model=s.TokenOut, status_code=201)
def register(data: s.RegisterIn, db: Session = Depends(get_db)):
    email = data.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(409, "An account with this email already exists")
    user = User(name=data.name, pharmacy_name=data.pharmacy, license_no=data.license,
                email=email, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_token(user.id), "user": user_out(user)}


@api.post("/auth/login", response_model=s.TokenOut)
def login(data: s.LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Incorrect email or password")
    return {"token": create_token(user.id), "user": user_out(user)}


@api.get("/auth/me", response_model=s.UserOut)
def me(user: User = Depends(current_user)):
    return user_out(user)


@api.put("/auth/me", response_model=s.UserOut)
def update_me(data: s.ProfileIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    user.name, user.pharmacy_name, user.low_stock_limit = data.name, data.pharmacy, data.low_stock_limit
    db.commit()
    return user_out(user)


# ---------- medicines ----------
@api.get("/medicines", response_model=list[s.MedicineOut])
def list_medicines(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Medicine).where(Medicine.owner_id == user.id).order_by(Medicine.id)).all()
    return [med_out(m, user.low_stock_limit) for m in rows]


@api.post("/medicines", response_model=s.MedicineOut, status_code=201)
def add_medicine(data: s.MedicineIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    m = Medicine(owner_id=user.id, **data.model_dump())
    db.add(m)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "A medicine with this product code already exists")
    db.refresh(m)
    return med_out(m, user.low_stock_limit)


@api.put("/medicines/{med_id}", response_model=s.MedicineOut)
def edit_medicine(med_id: int, data: s.MedicineIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    m = own_medicine(db, user, med_id)
    for k, v in data.model_dump().items():
        setattr(m, k, v)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "A medicine with this product code already exists")
    return med_out(m, user.low_stock_limit)


@api.delete("/medicines/{med_id}", status_code=204)
def delete_medicine(med_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    db.delete(own_medicine(db, user, med_id))
    db.commit()


# ---------- orders ----------
@api.get("/orders", response_model=list[s.OrderOut])
def list_orders(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Order).where(Order.owner_id == user.id).order_by(Order.id.desc())).all()
    return [order_out(o) for o in rows]


@api.post("/orders", response_model=s.OrderOut, status_code=201)
def add_order(data: s.OrderIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    o = Order(owner_id=user.id, **data.model_dump())
    db.add(o)
    db.commit()
    db.refresh(o)
    return order_out(o)


@api.patch("/orders/{order_id}", response_model=s.OrderOut)
def set_order_status(order_id: int, data: s.OrderStatusIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    o = db.get(Order, order_id)
    if not o or o.owner_id != user.id:
        raise HTTPException(404, "Order not found")
    o.status = data.status
    db.commit()
    return order_out(o)


# ---------- invoices ----------
@api.post("/invoices", response_model=s.InvoiceOut, status_code=201)
def create_invoice(data: s.InvoiceIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Checks every line, reduces stock and saves the sale in ONE transaction (all or nothing)."""
    wanted: dict[int, int] = {}
    for line in data.items:
        wanted[line.medicine_id] = wanted.get(line.medicine_id, 0) + line.qty

    inv = Invoice(owner_id=user.id, customer=data.customer.strip(), total=0)
    total = 0
    for med_id, qty in wanted.items():
        m = db.scalar(select(Medicine).where(Medicine.id == med_id, Medicine.owner_id == user.id).with_for_update())
        if not m:
            raise HTTPException(404, "Medicine not found")
        if m.exp < date.today():
            raise HTTPException(400, f"{m.name} is expired and cannot be sold")
        if qty > m.qty:
            raise HTTPException(400, f"Only {m.qty} of {m.name} in stock")
        m.qty -= qty
        total += m.price * qty
        inv.lines.append(InvoiceItem(medicine_id=m.id, name=m.name, price=m.price, qty=qty))
    inv.total = total
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return dict(id=inv.id, customer=inv.customer, total=float(inv.total), date=inv.created_at.date())


@api.get("/invoices", response_model=list[s.InvoiceOut])
def list_invoices(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Invoice).where(Invoice.owner_id == user.id).order_by(Invoice.id.desc()).limit(100)).all()
    return [dict(id=i.id, customer=i.customer, total=float(i.total), date=i.created_at.date()) for i in rows]


# ---------- dashboard ----------
@api.get("/dashboard", response_model=s.DashboardOut)
def dashboard(user: User = Depends(current_user), db: Session = Depends(get_db)):
    limit = user.low_stock_limit
    meds = [med_out(m, limit) for m in db.scalars(select(Medicine).where(Medicine.owner_id == user.id)).all()]
    by = lambda k: [m for m in meds if m["status"] == k]
    pct = lambda a, b: round(100 * a / b) if b else 0

    start = date.today() - timedelta(days=6)
    invoices = db.scalars(select(Invoice).where(
        Invoice.owner_id == user.id, Invoice.created_at >= datetime.combine(start, datetime.min.time()))).all()
    per_day: dict[date, float] = {}
    for i in invoices:
        per_day[i.created_at.date()] = per_day.get(i.created_at.date(), 0) + float(i.total)
    days = [start + timedelta(days=k) for k in range(7)]

    orders = db.scalars(select(Order).where(Order.owner_id == user.id)).all()
    return dict(
        week_sales=[{"d": d.strftime("%a"), "v": per_day.get(d, 0)} for d in days],
        week_total=sum(per_day.values()),
        out=by("out"), expired=by("expired"), low=by("low"),
        healthy_pct=pct(len(by("ok")), len(meds)),
        in_date_pct=pct(len(meds) - len(by("expired")), len(meds)),
        delivered_pct=pct(sum(o.status == "Delivered" for o in orders), len(orders)),
    )


app.include_router(api)
