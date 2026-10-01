from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class Cup(Base):
    __tablename__ = "cups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)          # コップの名前
    capacity_ml = Column(Integer, nullable=False)      # 容量(ml)
    color = Column(String(20), default="blue")         # コップのカラー


class WaterLog(Base):
    __tablename__ = "water_logs"

    id = Column(Integer, primary_key=True, index=True)
    amount_ml = Column(Integer, nullable=False)                 # 摂取量(ml)
    logged_at = Column(DateTime, default=datetime.now)          # 記録日時