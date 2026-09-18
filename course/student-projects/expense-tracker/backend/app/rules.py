"""Business rules for Expense Tracker BASE."""

ALLOWED_TRANSITIONS = {
    "recorded": ["reviewed"],
    "reviewed": ["closed"],
    "closed": [],
}


def can_transition(current: str, new_status: str) -> bool:
    return new_status in ALLOWED_TRANSITIONS.get(current, [])
