// middleware/validateTask.js
// "Never trust the client." — syntactic + semantic validation before data
// is allowed to reach the store. Bad input never gets past this gate.

const ALLOWED_PRIORITIES = ["standard", "critical"];

function validateTaskCreate(req, res, next) {
  const { label, priority } = req.body;
  const errors = [];

  if (typeof label !== "string" || label.trim().length === 0) {
    errors.push("label is required and must be a non-empty string.");
  } else if (label.length > 140) {
    errors.push("label must be 140 characters or fewer.");
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed.",
      errors
    });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { label, priority, done } = req.body;
  const errors = [];

  if (label !== undefined) {
    if (typeof label !== "string" || label.trim().length === 0) {
      errors.push("label must be a non-empty string.");
    } else if (label.length > 140) {
      errors.push("label must be 140 characters or fewer.");
    }
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${ALLOWED_PRIORITIES.join(", ")}.`);
  }

  if (done !== undefined && typeof done !== "boolean") {
    errors.push("done must be a boolean.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed.",
      errors
    });
  }

  next();
}

module.exports = { validateTaskCreate, validateTaskUpdate };
