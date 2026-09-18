from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user
from app.database import get_db
from app.models import Category, Expense, User
from app.rules import can_transition
from app.schemas import ExpenseCreate, ExpenseOut, ExpenseStatusUpdate, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["expenses"])


def to_out(expense: Expense) -> ExpenseOut:
    return ExpenseOut(
        id=expense.id,
        user_id=expense.user_id,
        category_id=expense.category_id,
        title=expense.title,
        amount=expense.amount,
        status=expense.status,
        notes=expense.notes,
        created_at=expense.created_at,
        updated_at=expense.updated_at,
        category_name=expense.category.name if expense.category else None,
    )


@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    status_filter: str | None = Query(default=None, alias="status"),
    q: str | None = Query(default=None, description="Search category name"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Expense).options(joinedload(Expense.category))
    if user.role != "admin":
        query = query.filter(Expense.user_id == user.id)
    if status_filter:
        query = query.filter(Expense.status == status_filter)
    if q:
        query = query.join(Category).filter(Category.name.ilike(f"%{q}%"))
    expenses = query.order_by(Expense.id.desc()).all()
    return [to_out(e) for e in expenses]


@router.post("", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "member":
        raise HTTPException(status_code=403, detail="Only members can create expenses")

    category = db.get(Category, payload.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Category does not exist")

    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")

    expense = Expense(
        user_id=user.id,
        category_id=category.id,
        title=payload.title,
        amount=payload.amount,
        notes=payload.notes,
        status="recorded",
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    expense = (
        db.query(Expense)
        .options(joinedload(Expense.category))
        .filter(Expense.id == expense.id)
        .one()
    )
    return to_out(expense)


@router.put("/{expense_id}", response_model=ExpenseOut)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .options(joinedload(Expense.category))
        .filter(Expense.id == expense_id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if user.role != "admin" and expense.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your expense")
    if expense.status == "closed":
        raise HTTPException(status_code=400, detail="Cannot edit a closed expense")

    data = payload.model_dump(exclude_unset=True)
    if "category_id" in data:
        category = db.get(Category, data["category_id"])
        if not category:
            raise HTTPException(status_code=400, detail="Category does not exist")
    if "amount" in data and data["amount"] is not None and data["amount"] <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")

    for key, value in data.items():
        setattr(expense, key, value)
    db.commit()
    db.refresh(expense)
    return to_out(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    expense = db.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if user.role != "admin" and expense.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your expense")
    if expense.status == "closed":
        raise HTTPException(status_code=400, detail="Cannot delete a closed expense")
    db.delete(expense)
    db.commit()
    return None


@router.patch("/{expense_id}/status", response_model=ExpenseOut)
def update_status(
    expense_id: int,
    payload: ExpenseStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update expense status")

    expense = (
        db.query(Expense)
        .options(joinedload(Expense.category))
        .filter(Expense.id == expense_id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if not can_transition(expense.status, payload.status):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{expense.status}' to '{payload.status}'",
        )

    expense.status = payload.status
    db.commit()
    db.refresh(expense)
    return to_out(expense)
