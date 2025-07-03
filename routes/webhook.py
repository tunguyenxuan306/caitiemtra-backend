from fastapi import APIRouter, Request
from models import Order
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/webhook")

@router.post("/vietqr")
async def vietqr_webhook(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    code = data.get("description") or ""
    order = db.query(Order).filter(Order.transfer_code == code).first()
    if order:
        order.status = "paid"
        db.commit()
    return {"status": "ok"}
