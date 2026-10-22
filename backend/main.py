from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from routers import cups
from routers import logs
from database import engine

# 定義したモデルを元にMySQLにテーブルを自動作成する
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Tracker API")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(cups.router)

app.include_router(logs.router)

# 疎通確認用
@app.get("/")
def read_root():
    return {"message": "Water Tracker API is running!"}