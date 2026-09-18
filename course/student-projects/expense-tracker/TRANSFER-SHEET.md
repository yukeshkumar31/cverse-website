# Transfer Sheet — Expense Tracker (filled)

**Student idea:** Expense Tracker  
**Trainer reference pattern:** Fix-My-Ride BASE  
**Course decision:** APPROVED WITH MODIFICATIONS (BASE only; extras → Enhance Later)

---

## 1. Problem

People lose track of daily spending across food, travel, and other costs. Paper notes and chat messages are easy to forget. A simple digital tracker should record expenses by category, keep a clear status for review, and let someone (admin) confirm entries without spreadsheets.

## 2. Roles (2 for BASE)

| Course role pattern | This project | What they do |
|---------------------|--------------|--------------|
| Primary user (Customer) | **Member** | Register/login, create/edit/delete own expenses, view categories, search own expenses |
| Staff | **Admin** | Login, manage categories CRUD, view all expenses, advance status |

## 3. Pattern rename

| Base pattern | Fix-My-Ride | Expense Tracker |
|--------------|-------------|-----------------|
| Primary user | Customer | Member |
| Owned / second entity | Bike | Category |
| Main transaction | Booking | Expense |
| Status values | booked / in_progress / completed | recorded / reviewed / closed |
| Staff role | Staff | Admin |

## 4. Entities (BASE)

| Entity | Fields | CRUD |
|--------|--------|------|
| User | email, password, full_name, role | Register / login |
| Category | name, description | Admin create/update/delete; all can list |
| Expense | user_id, category_id, title, amount, status, notes | Member create/update/delete own; Admin status |

## 5. Relationship

Each expense belongs to one member and one category.

## 6. Business rules (BASE)

1. Expense requires an existing category.  
2. Amount must be greater than 0.  
3. Status only moves `recorded → reviewed → closed` (no skipping).  
4. Members only see their own expenses; Admin sees all.  
5. Closed expenses cannot be edited/deleted by members.

## 7. Search / filter

Filter expenses by **status**; search by **category name**.

## 8. BASE checklist

- [x] Auth (register/login)
- [x] CRUD on category (admin)
- [x] Create/list/update/delete expenses
- [x] Relationship category ↔ expense
- [x] Status workflow (3 steps)
- [x] Backend business rules
- [x] Search/filter
- [x] Persistent data (SQLite/Postgres)
- [x] React ↔ FastAPI
- [x] Two roles
- [x] README + GitHub (on student branch)

## 9. Enhance Later

1. Monthly budgets / limits  
2. Receipt photo upload  
3. Bank / UPI sync  
4. Charts and monthly reports  
5. Multi-currency and shared household members  

## 10. Trainer decision

**APPROVED WITH MODIFICATIONS** — ship BASE above; postpone Enhance Later list.
