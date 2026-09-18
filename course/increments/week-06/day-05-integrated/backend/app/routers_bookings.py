from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user
from app.database import get_db
from app.models import Bike, Booking, User
from app.rules import can_transition
from app.schemas import BookingCreate, BookingOut, BookingStatusUpdate

router = APIRouter(prefix="/bookings", tags=["bookings"])


def to_out(booking: Booking) -> BookingOut:
    return BookingOut(
        id=booking.id,
        customer_id=booking.customer_id,
        bike_id=booking.bike_id,
        service_type=booking.service_type,
        status=booking.status,
        notes=booking.notes,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        bike_registration=booking.bike.registration_number if booking.bike else None,
    )


@router.get("", response_model=list[BookingOut])
def list_bookings(
    status_filter: str | None = Query(default=None, alias="status"),
    q: str | None = Query(default=None, description="Search registration number"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Booking).options(joinedload(Booking.bike))
    if user.role != "staff":
        query = query.filter(Booking.customer_id == user.id)
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    if q:
        query = query.join(Bike).filter(Bike.registration_number.ilike(f"%{q}%"))
    bookings = query.order_by(Booking.id.desc()).all()
    return [to_out(b) for b in bookings]


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "customer":
        raise HTTPException(status_code=403, detail="Only customers can create bookings")

    bike = db.get(Bike, payload.bike_id)
    if not bike:
        raise HTTPException(status_code=400, detail="Bike does not exist")
    if bike.owner_id != user.id:
        raise HTTPException(status_code=400, detail="You can only book your own bike")

    booking = Booking(
        customer_id=user.id,
        bike_id=bike.id,
        service_type=payload.service_type,
        notes=payload.notes,
        status="booked",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.bike))
        .filter(Booking.id == booking.id)
        .one()
    )
    return to_out(booking)


@router.patch("/{booking_id}/status", response_model=BookingOut)
def update_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "staff":
        raise HTTPException(status_code=403, detail="Only staff can update booking status")

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.bike))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if not can_transition(booking.status, payload.status):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{booking.status}' to '{payload.status}'",
        )

    booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return to_out(booking)
