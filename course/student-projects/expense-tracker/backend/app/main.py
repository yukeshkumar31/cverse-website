from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Category, Expense, User
from app.routers_auth import router as auth_router
from app.routers_categories import router as categories_router
from app.routers_expenses import router as expenses_router

app = FastAPI(title="Expense Tracker BASE", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(expenses_router)


@app.get("/health")
def health():
    return {"status": "ok", "app": "expense-tracker-base"}


def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return

        member = User(
            email="member@demo.com",
            password_hash=hash_password("demo1234"),
            full_name="Demo Member",
            role="member",
        )
        admin = User(
            email="admin@demo.com",
            password_hash=hash_password("demo1234"),
            full_name="Demo Admin",
            role="admin",
        )
        db.add_all([member, admin])
        db.commit()
        db.refresh(member)

        category = Category(name="Food", description="Meals and groceries")
        db.add(category)
        db.commit()
        db.refresh(category)

        expense = Expense(
            user_id=member.id,
            category_id=category.id,
            title="Lunch",
            amount=150.00,
            status="recorded",
            notes="Campus canteen",
        )
        db.add(expense)
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
