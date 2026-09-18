"""Business rules for Fix-My-Ride BASE."""

ALLOWED_TRANSITIONS = {
    "booked": ["in_progress"],
    "in_progress": ["completed"],
    "completed": [],
}


def can_transition(current: str, new_status: str) -> bool:
    return new_status in ALLOWED_TRANSITIONS.get(current, [])


def next_statuses(current: str) -> list[str]:
    return list(ALLOWED_TRANSITIONS.get(current, []))
