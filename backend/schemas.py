from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# --- コップ関連のスキーマ ---
class CupCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="容器の名前")
    capacity_ml: int = Field(..., gt=0, le=5000, description="容量(ml)は1以上5000以下")
    color: Optional[str] = Field("blue", max_length=20)
    type: Optional[str] = Field("cup", pattern="^(cup|bottle)$", description="cup または bottle")

class CupResponse(CupCreate):
    id: int
    class Config:
        from_attributes = True

# --- 水分ログ関連のスキーマ ---
class WaterLogCreate(BaseModel):
    amount_ml: int = Field(..., gt=0, description="飲水量(ml)は1以上")

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