# Demo Scripts — Fix-My-Ride (3 minutes each)

## Week 1 — Paper flow

**Show:** Board diagram User → Frontend → Backend → Database.  
**Say:** “Customer books service. Staff updates status. History stays.”  
**Ask:** “Is the button the whole app?”  
**Expected:** No.

## Week 2 — Mock UI

**Show:** Add a bike, create a booking, filter by status.  
**Say:** “Looks real, but refresh loses nothing only until we refresh — wait, mock resets on refresh.”  
**Ask:** “Where is the data living?”  
**Expected:** Inside the browser / React state.

## Week 3 — Memory API

**Show:** `/docs` POST bike, POST booking, invalid status jump → 400.  
**Say:** “Backend now owns the rule.”  
**Ask:** “What happens if we restart the server?”  
**Expected:** Data gone.

## Week 4 — SQL

**Show:** `\dt`, `SELECT` with JOIN.  
**Say:** “Tables are how the computer remembers with structure.”  
**Ask:** “Why do we need bike_id on bookings?”  
**Expected:** Relationship / which bike.

## Week 5 — DB-backed API

**Show:** Create booking, restart API, data still there.  
**Say:** “We replaced temporary memory with PostgreSQL.”  

## Week 6 — Full stack

**Show:** React form → Network tab → API → row in DB.  
**Say:** “This is the full journey.”  
**Break it:** Wrong URL → teach debugging process.

## Week 7 — Auth

**Show:** Customer login sees own bikes; Staff sees all bookings and status buttons.  
**Say:** “Same app, different permissions.”  

## Week 8 — Demo day

Student presents:

1. Problem  
2. BASE features built  
3. Live click-through  
4. One business rule  
5. Enhance Later list  
