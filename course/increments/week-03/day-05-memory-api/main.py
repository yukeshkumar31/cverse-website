from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Fix-My-Ride memory API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED = {
    "booked": ["in_progress"],
    "in_progress": ["completed"],
    "completed": [],
}

bikes = [
    {"id": 1, "make": "Honda", "model": "Activa", "registration_number": "TN28AB1234"},
]
bookings = [
    {
        "id": 1,
        "bike_id": 1,
        "service_type": "General service",
        "status": "booked",
        "notes": "Brake noise",
    },
]
next_bike_id = 2
next_booking_id = 2


class BikeIn(BaseModel):
    make: str = Field(min_length=1)
    model: str = Field(min_length=1)
    registration_number: str = Field(min_length=1)


class BookingIn(BaseModel):
    bike_id: int
    service_type: str = Field(min_length=1)
    notes: str | None = None


class StatusIn(BaseModel):
    status: str


@app.get("/health")
def health():
    return {"status": "ok", "store": "memory"}


@app.get("/bikes")
def list_bikes():
    return bikes


@app.post("/bikes", status_code=201)
def create_bike(payload: BikeIn):
    global next_bike_id
    reg = payload.registration_number.upper()
    if any(b["registration_number"] == reg for b in bikes):
        raise HTTPException(400, "Registration number already exists")
    bike = {
        "id": next_bike_id,
        "make": payload.make,
        "model": payload.model,
        "registration_number": reg,
    }
    next_bike_id += 1
    bikes.append(bike)
    return bike


@app.get("/bookings")
def list_bookings(status: str | None = None):
    if status:
        return [b for b in bookings if b["status"] == status]
    return bookings


@app.post("/bookings", status_code=201)
def create_booking(payload: BookingIn):
    global next_booking_id
    if not any(b["id"] == payload.bike_id for b in bikes):
        raise HTTPException(400, "Bike does not exist")
    booking = {
        "id": next_booking_id,
        "bike_id": payload.bike_id,
        "service_type": payload.service_type,
        "status": "booked",
        "notes": payload.notes,
    }
    next_booking_id += 1
    bookings.append(booking)
    return booking


@app.patch("/bookings/{booking_id}/status")
def update_status(booking_id: int, payload: StatusIn):
    booking = next((b for b in bookings if b["id"] == booking_id), None)
    if not booking:
        raise HTTPException(404, "Booking not found")
    current = booking["status"]
    if payload.status not in ALLOWED.get(current, []):
        raise HTTPException(
            400,
            f"Cannot change status from '{current}' to '{payload.status}'",
        )
    booking["status"] = payload.status
    return booking
