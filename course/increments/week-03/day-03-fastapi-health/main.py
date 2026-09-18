from fastapi import FastAPI

app = FastAPI(title="Fix-My-Ride health")


@app.get("/health")
def health():
    return {"status": "ok", "week": "3-day-3"}
