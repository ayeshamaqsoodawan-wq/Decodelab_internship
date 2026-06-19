// data/store.js
// Simple in-memory "database" — resets every time the server restarts.
// In a later project this would be swapped for a real database (MongoDB, Postgres, etc.)
// without changing the route logic, since access goes through these functions only.

let tasks = [
  { id: 1, label: "Wireframe the header in grayscale", priority: "standard", done: true },
  { id: 2, label: "Build CSS Grid macro layout", priority: "critical", done: true },
  { id: 3, label: "Add Flexbox nav components", priority: "standard", done: false },
  { id: 4, label: "Test breakpoints at 768px and 1024px", priority: "critical", done: false }
];

let nextId = 5;

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((t) => t.id === id);
}

function create({ label, priority, done }) {
  const task = {
    id: nextId++,
    label,
    priority: priority || "standard",
    done: Boolean(done) || false
  };
  tasks.push(task);
  return task;
}

function update(id, changes) {
  const task = getById(id);
  if (!task) return null;
  Object.assign(task, changes);
  return task;
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
