// Drafting Board — basic state management & interactivity (vanilla JS, no frameworks)

(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  navToggle.addEventListener("click", function () {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // close mobile nav after tapping a link
  primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ---- Task state (in-memory; resets on reload) ----
  let nextId = 5;
  let currentFilter = "all";

  const tasks = [
    { id: 1, label: "Wireframe the header in grayscale", priority: "standard", done: true },
    { id: 2, label: "Build CSS Grid macro layout", priority: "critical", done: true },
    { id: 3, label: "Add Flexbox nav components", priority: "standard", done: false },
    { id: 4, label: "Test breakpoints at 768px and 1024px", priority: "critical", done: false }
  ];

  const taskGrid = document.getElementById("taskGrid");
  const openCount = document.getElementById("openCount");
  const doneCount = document.getElementById("doneCount");
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskPriority = document.getElementById("taskPriority");
  const filterButtons = document.getElementById("filterButtons");
  const newTaskBtn = document.getElementById("newTaskBtn");

  function render() {
    const visible = tasks.filter(function (t) {
      if (currentFilter === "open") return !t.done;
      if (currentFilter === "done") return t.done;
      return true;
    });

    taskGrid.innerHTML = "";

    if (visible.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Nothing on the board for this filter yet.";
      taskGrid.appendChild(empty);
    } else {
      visible.forEach(function (t) {
        taskGrid.appendChild(buildCard(t));
      });
    }

    openCount.textContent = tasks.filter(function (t) { return !t.done; }).length;
    doneCount.textContent = tasks.filter(function (t) { return t.done; }).length;
  }

  function buildCard(t) {
    const article = document.createElement("article");
    article.className = "task-card" + (t.done ? " is-done" : "");
    article.setAttribute("data-priority", t.priority);

    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = (t.priority === "critical" ? "Critical path" : "Standard") + " · #" + t.id;

    const title = document.createElement("h4");
    title.textContent = t.label;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "is-done-btn" + (t.done ? " is-active" : "");
    doneBtn.textContent = t.done ? "Completed" : "Mark complete";
    doneBtn.addEventListener("click", function () {
      t.done = !t.done;
      render();
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function () {
      const idx = tasks.findIndex(function (x) { return x.id === t.id; });
      if (idx > -1) tasks.splice(idx, 1);
      render();
    });

    actions.appendChild(doneBtn);
    actions.appendChild(removeBtn);

    article.appendChild(meta);
    article.appendChild(title);
    article.appendChild(actions);
    return article;
  }

  // ---- Add new task ----
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const label = taskInput.value.trim();
    if (!label) return;

    tasks.unshift({
      id: nextId++,
      label: label,
      priority: taskPriority.value,
      done: false
    });

    taskInput.value = "";
    currentFilter = "all";
    setActiveChip("all");
    render();
    taskInput.focus();
  });

  // shortcut: header "+ New Item" jumps to board and focuses the input
  newTaskBtn.addEventListener("click", function () {
    document.getElementById("board").scrollIntoView({ behavior: "smooth", block: "start" });
    taskInput.focus();
  });

  // ---- Filters ----
  function setActiveChip(filter) {
    filterButtons.querySelectorAll(".chip").forEach(function (chip) {
      chip.classList.toggle("is-active", chip.dataset.filter === filter);
    });
  }

  filterButtons.addEventListener("click", function (e) {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    setActiveChip(currentFilter);
    render();
  });

  render();
})();
