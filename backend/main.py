from fastapi import FastAPI

app = FastAPI(title="Water Tracker API")

@app.get("/")
def read_root():
    return {"message": "Water Tracker API is running!"}