from sqlalchemy import Column, Integer, String, DateTime
from app_timezone import now_jst_naive
from database import Base

class Cup(Base):
    __tablename__ = "cups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)          # コップの名前
    capacity_ml = Column(Integer, nullable=False)      # 容量(ml)
    color = Column(String(20), default="blue")         # コップのカラー
    type = Column(String(20), default="cup")           # タイプ(cup or bottle)


class WaterLog(Base):
    __tablename__ = "water_logs"

    id = Column(Integer, primary_key=True, index=True)
    amount_ml = Column(Integer, nullable=False)                 # 摂取量(ml)
    logged_at = Column(DateTime, default=now_jst_naive)          # 日本時間の記録日時