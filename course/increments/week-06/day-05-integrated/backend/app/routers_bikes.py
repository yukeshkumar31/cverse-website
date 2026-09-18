from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Bike, User
from app.schemas import BikeCreate, BikeOut, BikeUpdate

router = APIRouter(prefix="/bikes", tags=["bikes"])


@router.get("", response_model=list[BikeOut])
def list_bikes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == "staff":
        return db.query(Bike).order_by(Bike.id.desc()).all()
    return db.query(Bike).filter(Bike.owner_id == user.id).order_by(Bike.id.desc()).all()


@router.post("", response_model=BikeOut, status_code=status.HTTP_201_CREATED)
def create_bike(
    payload: BikeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "customer":
        raise HTTPException(status_code=403, detail="Only customers can add bikes")

    exists = db.query(Bike).filter(Bike.registration_number == payload.registration_number).first()
    if exists:
        raise HTTPException(status_code=400, detail="Registration number already exists")

    bike = Bike(
        owner_id=user.id,
        make=payload.make,
        model=payload.model,
        registration_number=payload.registration_number.upper(),
    )
    db.add(bike)
    db.commit()
    db.refresh(bike)
    return bike


@router.put("/{bike_id}", response_model=BikeOut)
def update_bike(
    bike_id: int,
    payload: BikeUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    bike = db.get(Bike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    if user.role != "staff" and bike.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not your bike")

    data = payload.model_dump(exclude_unset=True)
    if "registration_number" in data and data["registration_number"]:
        data["registration_number"] = data["registration_number"].upper()
    for key, value in data.items():
        setattr(bike, key, value)
    db.commit()
    db.refresh(bike)
    return bike


@router.delete("/{bike_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bike(
    bike_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    bike = db.get(Bike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    if user.role != "staff" and bike.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Not your bike")
    if bike.bookings:
        raise HTTPException(status_code=400, detail="Cannot delete a bike that has bookings")
    db.delete(bike)
    db.commit()
    return None
