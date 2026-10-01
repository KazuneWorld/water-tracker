from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- コップ関連のスキーマ ---
class CupCreate(BaseModel):
    name: str
    capacity_ml: int
    color: Optional[str] = "blue"

class CupResponse(CupCreate):
    id: int
    class Config:
        from_attributes = True

# --- 水分ログ関連のスキーマ ---
class WaterLogCreate(BaseModel):
    amount_ml: int

class WaterLogResponse(BaseModel):
    id: int
    amount_ml: int
    logged_at: datetime
    class Config:
        from_attributes = True

# --- 本日の集計レスポンス用 ---
class TodaySummaryResponse(BaseModel):
    total_amount_ml: int
    logs: list[WaterLogResponse]