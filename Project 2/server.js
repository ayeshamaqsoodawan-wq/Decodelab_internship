// server.js
// Project 2 — Backend API Development | DecodeLabs Industrial Training Kit
// "The web is a dynamic, inclusive information system." — Project 1 was the skin.
// This is the nervous system: the application's brain.

const express = require("express");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON bodies — the API's "neurotransmitter" is JSON.
app.use(express.json());

// Tiny request logger, so every signal through the system is visible.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Health check — lets a client (or a deploy platform) confirm the server is alive.
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Drafting Board API is running.",
    endpoints: {
      list: "GET /api/tasks",
      filterByStatus: "GET /api/tasks?done=true|false",
      getOne: "GET /api/tasks/:id",
      create: "POST /api/tasks",
      update: "PUT /api/tasks/:id",
      remove: "DELETE /api/tasks/:id"
    }
  });
});

// Resource routes
app.use("/api/tasks", tasksRouter);

// 404 — anything that doesn't match a known route or resource id
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.method} ${req.originalUrl} does not exist.`
  });
});

// Centralized error handler — catches anything thrown or passed to next(err)
// so the server never leaks a raw stack trace to the client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server."
  });
});

app.listen(PORT, () => {
  console.log(`Drafting Board API listening on http://localhost:${PORT}`);
});
