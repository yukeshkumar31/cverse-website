/** Fix-My-Ride BASE — status transition rules (no UI yet) */

const ALLOWED = {
  booked: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
};

function canTransition(current, next) {
  return (ALLOWED[current] || []).includes(next);
}

function assertTransition(current, next) {
  if (!canTransition(current, next)) {
    throw new Error(`Cannot change status from '${current}' to '${next}'`);
  }
  return next;
}

console.log("booked -> in_progress:", canTransition("booked", "in_progress"));
console.log("booked -> completed:", canTransition("booked", "completed"));

try {
  assertTransition("booked", "completed");
} catch (err) {
  console.log("Rule caught bad jump:", err.message);
}

console.log("OK after booked -> in_progress:", assertTransition("booked", "in_progress"));
