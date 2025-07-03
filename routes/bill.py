from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import BillTemplate
from database import get_db

router = APIRouter(prefix="/bill-template")

@router.get("/")
def get_template(db: Session = Depends(get_db)):
    template = db.query(BillTemplate).first()
    return {
        "html": template.template_html if template else "",
        "css": template.template_css if template else ""
    }

@router.post("/")
def update_template(payload: dict, db: Session = Depends(get_db)):
    template = db.query(BillTemplate).first()
    if not template:
        template = BillTemplate()
        db.add(template)
    template.template_html = payload.get("html", "")
    template.template_css = payload.get("css", "")
    db.commit()
    return {"message": "Updated"}
