from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base, MenuItem, Order, User, BillTemplate
from config import DATABASE_URL
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Cái Tiệm Trà Backend")

engine = create_engine(DATABASE_URL, echo=False)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemas
class MenuItemCreate(BaseModel):
    name: str
    price: float
    image_url: str
    is_available: bool

class OrderCreate(BaseModel):
    items: list
    payment_method: str

# Routes
@app.get("/menu", response_model=List[dict])
def get_menu(db: Session = Depends(get_db)):
    return [m.__dict__ for m in db.query(MenuItem).all()]

@app.post("/menu")
def add_menu(item: MenuItemCreate, db: Session = Depends(get_db)):
    new_item = MenuItem(**item.dict())
    db.add(new_item)
    db.commit()
    return {"message": "Created"}

@app.post("/order")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    new_order = Order(items=order.items, total_amount=sum(i['price'] * i['qty'] for i in order.items),
                      payment_method=order.payment_method)
    db.add(new_order)
    db.commit()
    return {"order_id": new_order.id, "total_amount": new_order.total_amount}

# Bill template
@app.get("/bill-template")
def get_bill_template(db: Session = Depends(get_db)):
    template = db.query(BillTemplate).first()
    return {"html": template.template_html, "css": template.template_css} if template else {}

@app.post("/bill-template")
def set_bill_template(html: str, css: str, db: Session = Depends(get_db)):
    template = db.query(BillTemplate).first()
    if template:
        template.template_html = html
        template.template_css = css
    else:
        template = BillTemplate(template_html=html, template_css=css)
        db.add(template)
    db.commit()
    return {"message": "Updated"}
