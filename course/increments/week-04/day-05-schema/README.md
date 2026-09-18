# Week 4 Day 5 — PostgreSQL schema

```bash
createdb fixmyride
psql -d fixmyride -f schema.sql
psql -d fixmyride -f seed.sql
psql -d fixmyride -c "\dt"
```

Practice joins:

```sql
SELECT b.id, b.status, bk.registration_number, b.service_type
FROM bookings b
JOIN bikes bk ON bk.id = b.bike_id;
```

Note: prefer creating demo users via the Week 5+ API seed if password hashes do not match.
