from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional
from database import get_db
import models
import schemas

router = APIRouter(prefix="/logs", tags=["logs"])

# 1. 水分補給の記録（POST /logs）
@router.post("", response_model=schemas.WaterLogResponse, status_code=status.HTTP_201_CREATED)
def create_log(log_in: schemas.WaterLogCreate, db: Session = Depends(get_db)):
    new_log = models.WaterLog(amount_ml=log_in.amount_ml)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

# 2. 日別サマリー取得（GET /logs）
@router.get("", response_model=schemas.DailySummaryResponse)
def get_daily_summary(
    target_date: Optional[date] = None, 
    db: Session = Depends(get_db)
):
    query_date = target_date or date.today()

    logs = (
        db.query(models.WaterLog)
        .filter(func.date(models.WaterLog.logged_at) == query_date)
        .order_by(models.WaterLog.logged_at.desc())
        .all()
    )

    total = sum(log.amount_ml for log in logs)

    return {
        "date": query_date,
        "total_amount_ml": total,
        "logs": logs
    }

# 3. ログの編集（当日のみ許可）(PUT /logs/{log_id})
@router.put("/{log_id}", response_model=schemas.WaterLogResponse)
def update_log(
    log_id: int, 
    log_in: schemas.WaterLogUpdate, 
    db: Session = Depends(get_db)
):
    log = db.query(models.WaterLog).filter(models.WaterLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="該当のログが見つかりません"
        )
    
    # 当日チェック: 記録日が今日でない場合は拒否
    if log.logged_at.date() != date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="過去日のログは編集できません（当日のログのみ操作可能です）"
        )

    log.amount_ml = log_in.amount_ml
    db.commit()
    db.refresh(log)
    return log

# 4. ログの削除（当日のみ許可）(DELETE /logs/{log_id})
@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(models.WaterLog).filter(models.WaterLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="該当のログが見つかりません"
        )
    
    # 当日チェック: 記録日が今日でない場合は拒否
    if log.logged_at.date() != date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="過去日のログは削除できません（当日のログのみ操作可能です）"
        )
    
    db.delete(log)
    db.commit()
    return None