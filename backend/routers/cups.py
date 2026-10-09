from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

# ルーターの定義
router = APIRouter(
    prefix="/cups",
    tags=["cups"]
)

# 1. 容器一覧取得 API
@router.get("", response_model=list[schemas.CupResponse])
def get_cups(db: Session = Depends(get_db)):
    return db.query(models.Cup).all()

# 2. 容器新規登録 API
@router.post("", response_model=schemas.CupResponse)
def create_cup(cup: schemas.CupCreate, db: Session = Depends(get_db)):
    db_cup = models.Cup(
        name=cup.name,
        capacity_ml=cup.capacity_ml,
        color=cup.color,
        type=cup.type
    )
    db.add(db_cup)
    db.commit()
    db.refresh(db_cup)
    return db_cup

# 3. 容器削除 API
@router.delete("/{cup_id}")
def delete_cup(cup_id: int, db: Session = Depends(get_db)):
    db_cup = db.query(models.Cup).filter(models.Cup.id == cup_id).first()
    # もし該当するコップが存在しない場合は404エラーを返す
    if not db_cup:
        raise HTTPException(status_code=404, detail="Cup not found")
    
    db.delete(db_cup)
    db.commit()
    return {"message": "Cup deleted successfully"}