from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Bike, Booking, User
from app.routers_auth import router as auth_router
from app.routers_bikes import router as bikes_router
from app.routers_bookings import router as bookings_router

app = FastAPI(title="Fix-My-Ride BASE", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(bikes_router)
app.include_router(bookings_router)


@app.get("/health")
def health():
    return {"status": "ok", "app": "fix-my-ride-base"}


def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return

        customer = User(
            email="customer@demo.com",
            password_hash=hash_password("demo1234"),
            full_name="Demo Customer",
            role="customer",
        )
        staff = User(
            email="staff@demo.com",
            password_hash=hash_password("demo1234"),
            full_name="Demo Staff",
            role="staff",
        )
        db.add_all([customer, staff])
        db.commit()
        db.refresh(customer)

        bike = Bike(
            owner_id=customer.id,
            make="Honda",
            model="Activa",
            registration_number="TN28AB1234",
        )
        db.add(bike)
        db.commit()
        db.refresh(bike)

        booking = Booking(
            customer_id=customer.id,
            bike_id=bike.id,
            service_type="General service",
            status="booked",
            notes="Strange noise when braking",
        )
        db.add(booking)
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_demo_data()
