from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import MenuItem
from database import get_db

router = APIRouter(prefix="/menu")

@router.get("/")
def get_menu(db: Session = Depends(get_db)):
    return db.query(MenuItem).all()

@router.post("/")
def create_item(item: dict, db: Session = Depends(get_db)):
    new_item = MenuItem(**item)
    db.add(new_item)
    db.commit()
    return {"message": "Item created"}

@router.put("/{item_id}")
def update_item(item_id: int, update: dict, db: Session = Depends(get_db)):
    item = db.query(MenuItem).get(item_id)
    for key, value in update.items():
        setattr(item, key, value)
    db.commit()
    return {"message": "Updated"}
