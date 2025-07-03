from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Order
from database import get_db

router = APIRouter(prefix="/order")

@router.post("/")
def create_order(order: dict, db: Session = Depends(get_db)):
    new_order = Order(**order)
    db.add(new_order)
    db.commit()
    return {"order_id": new_order.id}
