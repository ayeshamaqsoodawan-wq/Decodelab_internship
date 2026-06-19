// routes/tasks.js
// RESTful naming: resources are nouns, methods are verbs.
//   GET    /api/tasks       -> list all tasks
//   GET    /api/tasks/:id   -> get one task
//   POST   /api/tasks       -> create a task
//   PUT    /api/tasks/:id   -> update a task
//   DELETE /api/tasks/:id   -> remove a task

const express = require("express");
const router = express.Router();
const store = require("../data/store");
const { validateTaskCreate, validateTaskUpdate } = require("../middleware/validateTask");

// GET /api/tasks  — optional ?done=true|false filter
router.get("/", (req, res) => {
  let tasks = store.getAll();

  if (req.query.done !== undefined) {
    const wantDone = req.query.done === "true";
    tasks = tasks.filter((t) => t.done === wantDone);
  }

  res.status(200).json({
    status: "success",
    count: tasks.length,
    data: tasks
  });
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = store.getById(id);

  if (!task) {
    return res.status(404).json({
      status: "error",
      message: `Task with id ${id} was not found.`
    });
  }

  res.status(200).json({ status: "success", data: task });
});

// POST /api/tasks
router.post("/", validateTaskCreate, (req, res) => {
  const { label, priority, done } = req.body;
  const task = store.create({ label: label.trim(), priority, done });

  res.status(201).json({
    status: "success",
    message: "Task created.",
    data: task
  });
});

// PUT /api/tasks/:id
router.put("/:id", validateTaskUpdate, (req, res) => {
  const id = Number(req.params.id);
  const existing = store.getById(id);

  if (!existing) {
    return res.status(404).json({
      status: "error",
      message: `Task with id ${id} was not found.`
    });
  }

  const updated = store.update(id, req.body);
  res.status(200).json({
    status: "success",
    message: "Task updated.",
    data: updated
  });
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const removed = store.remove(id);

  if (!removed) {
    return res.status(404).json({
      status: "error",
      message: `Task with id ${id} was not found.`
    });
  }

  res.status(204).send();
});

module.exports = router;
