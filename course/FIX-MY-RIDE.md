# Fix-My-Ride — Reference Project (BASE)

**Owner of the idea (story):** Hari's bike service process.  
**Role in course:** Trainer demonstration and incremental reference app.  
**Students:** Do not all build Fix-My-Ride — they build their own idea using the same base patterns.

---

## Problem (keep)

Bike service is largely manual aside from occasional online invoices. When a customer leaves a bike, details discussed can be forgotten — especially if different people handle the bike later. The shop needs a clear **digital service-process record**.

---

## BASE version (build in 8 weeks)

### Roles (2 only)

| Role | Can do |
|------|--------|
| **Customer** | Register/login, manage own bikes, create bookings, view own booking history, search own bookings |
| **Staff** | Login, see all bookings, update booking status, search all bookings, view bikes/customers as needed for service |

> Staff stands in for technician + branch manager in the full vision. Keep one staff role for the course.

### Entities

| Table / concept | Purpose |
|-----------------|---------|
| `users` | email, password_hash, role (`customer` \| `staff`), name |
| `bikes` | customer_user_id, make, model, registration_number |
| `bookings` | customer_user_id, bike_id, service_type, status, notes, created_at, updated_at |

Optional simplification: customer profile fields live on `users` (name, phone) — no separate `customers` table required for BASE.

### Status workflow

```text
booked → in_progress → completed
```

Invalid jumps (e.g. `booked` → `completed`) must be rejected by the **backend**.

### Core workflow

```text
Customer creates booking (must pick an existing bike)
        ↓
Staff sees booking list
        ↓
Staff moves status: booked → in_progress → completed
        ↓
Customer and Staff can view / search history
```

### Business rules (BASE)

1. Booking requires an existing bike owned by the customer.  
2. Status may only move forward along the allowed path.  
3. Customers only see/edit their own bikes and bookings; Staff see all bookings.  
4. Required fields validated (e.g. service_type not empty).

### Search / filter

Filter bookings by **status** and optionally by **registration number** (or customer name for Staff).

### Stack end state

```text
React (Vite, JavaScript)
  → REST / JSON
  → FastAPI
  → SQLAlchemy
  → PostgreSQL
```

---

## POSTPONE (Enhance Later — do not require)

- Organisation / multi-branch  
- Technician assignment accept/decline  
- Inspection checklist  
- Accessory recommendations + customer approve/reject  
- Invoice generation + online payment gateway  
- SMS / WhatsApp / email / push notifications  
- GPS / real-time tracking  
- AI diagnosis  
- Inventory / suppliers  
- Advanced analytics / accounting / insurance  
- Native mobile app  
- Microservices  

Trainer line:

> “This is the base. Your full Fix-My-Ride vision can grow after the course.”

---

## Entity relationship (BASE)

```text
users (1) ──< bikes
users (1) ──< bookings
bikes (1) ──< bookings
```

---

## Demo accounts (seed)

| Email | Password | Role |
|-------|----------|------|
| customer@demo.com | demo1234 | customer |
| staff@demo.com | demo1234 | staff |

(Use these in Week 7–8 demos; document in reference-app README.)

---

## Where the code lives

- Final app: [`reference-app/fix-my-ride/`](reference-app/fix-my-ride/)  
- Day checkpoints: [`increments/`](increments/)  
- Day lessons: [`weeks/`](weeks/)
