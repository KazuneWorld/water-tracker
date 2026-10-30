from datetime import datetime, timedelta
from fastapi.testclient import TestClient

import models
from database import SessionLocal
from main import app

client = TestClient(app)

# 1. 水分補給ログが正常に作成できるかテスト (POST /logs)
def test_create_water_log():
    response = client.post("/logs", json={"amount_ml": 200})
    assert response.status_code == 201
    data = response.json()
    assert data["amount_ml"] == 200
    assert "id" in data
    assert "logged_at" in data
    assert data["logged_at"].endswith("+09:00")

# 2. 日別の水分補給の合計量とログ一覧が取得できるかテスト (GET /logs)
def test_get_daily_summary():
    client.post("/logs", json={"amount_ml": 300})

    response = client.get("/logs")
    assert response.status_code == 200
    data = response.json()
    assert "total_amount_ml" in data
    assert isinstance(data["logs"], list)
    assert data["total_amount_ml"] >= 300

# 3. 当日のログ編集が成功することをテスト (PUT /logs/{log_id})
def test_update_today_log_success():
    create_res = client.post("/logs", json={"amount_ml": 200})
    log_id = create_res.json()["id"]

    update_res = client.put(f"/logs/{log_id}", json={"amount_ml": 350})
    assert update_res.status_code == 200
    assert update_res.json()["amount_ml"] == 350

# 4. 過去日のログ編集が拒否されることをテスト (PUT /logs/{log_id})
def test_update_past_log_fails():
    with SessionLocal() as db:
        yesterday = datetime.now() - timedelta(days=1)
        past_log = models.WaterLog(amount_ml=200, logged_at=yesterday)
        db.add(past_log)
        db.commit()
        db.refresh(past_log)
        past_log_id = past_log.id

    update_res = client.put(f"/logs/{past_log_id}", json={"amount_ml": 400})
    assert update_res.status_code == 400
    assert "過去日のログは編集できません" in update_res.json()["detail"]

# 5. 当日のログ削除が成功することをテスト (DELETE /logs/{log_id})
def test_delete_today_log_success():
    create_res = client.post("/logs", json={"amount_ml": 200})
    log_id = create_res.json()["id"]

    delete_res = client.delete(f"/logs/{log_id}")
    assert delete_res.status_code == 204

# 6. 過去日のログ削除が拒否されることをテスト (DELETE /logs/{log_id})
def test_delete_past_log_fails():
    with SessionLocal() as db:
        yesterday = datetime.now() - timedelta(days=1)
        past_log = models.WaterLog(amount_ml=300, logged_at=yesterday)
        db.add(past_log)
        db.commit()
        db.refresh(past_log)
        past_log_id = past_log.id

    delete_res = client.delete(f"/logs/{past_log_id}")
    assert delete_res.status_code == 400
    assert "過去日のログは削除できません" in delete_res.json()["detail"]