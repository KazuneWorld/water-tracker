from fastapi.testclient import TestClient
from main import app

# FastAPIアプリをテスト用クライアントに渡す
client = TestClient(app)

# 容器の一覧取得 (GET /cups) のテスト
def test_get_cups():
    response = client.get("/cups")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# 容器の新規登録 (POST /cups) のテスト
def test_create_cup_success():
    payload = {
        "name": "テストマグ",
        "capacity_ml": 300,
        "color": "red",
        "type": "cup"
    }
    response = client.post("/cups", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == "テストマグ"
    assert data["capacity_ml"] == 300
    assert data["type"] == "cup"
    assert "id" in data

# 容器の削除 (DELETE /cups/{cup_id}) のテスト
def test_delete_cup_success():
    # 1. まず新しい容器を作成して、そのIDを取得する
    payload = {
        "name": "削除用カップ",
        "capacity_ml": 250,
        "color": "green",
        "type": "cup"
    }
    create_response = client.post("/cups", json=payload)
    cup_id = create_response.json()["id"]

    # 2. 作成した容器を削除する
    delete_response = client.delete(f"/cups/{cup_id}")
    assert delete_response.status_code == 200

    # 3. 削除後に一覧を取得し、削除したIDがリストに含まれないことを確認する
    get_response = client.get("/cups")
    assert get_response.status_code == 200
    
    cups = get_response.json()
    cup_ids = [cup["id"] for cup in cups]
    assert cup_id not in cup_ids

# バリデーションエラーのテスト : capacity_mlが0以下の場合
def test_create_cup_invalid_capacity():
    payload = {
        "name": "不正な容量",
        "capacity_ml": 0,
        "color": "blue",
        "type": "cup"
    }
    response = client.post("/cups", json=payload)
    # バリデーションエラーは HTTP 422 (Unprocessable Entity) が返ってくる
    assert response.status_code == 422