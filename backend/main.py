from fastapi import FastAPI
import models
from database import engine

# 定義したモデルを元にMySQLにテーブルを自動作成する
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Tracker API")

@app.get("/")
def read_root():
    return {"message": "Water Tracker API is running!"}