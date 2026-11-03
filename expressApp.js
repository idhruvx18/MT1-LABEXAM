import express from 'express';

const app = express();

// Middleware – parse incoming JSON bodies
app.use(express.json());

// ── In-memory task store ────────────────────────────────────────────────────
let tasks = [
  {
    id: 1,
    taskName: 'Develop Login Page',
    assignedTo: 'Rahul Sharma',
    status: 'Pending',
    priority: 'High'
  },
  {
    id: 2,
    taskName: 'Design Database Schema',
    assignedTo: 'Priya Mehta',
    status: 'In Progress',
    priority: 'Medium'
  },
  {
    id: 3,
    taskName: 'Write Unit Tests',
    assignedTo: 'Arjun Verma',
    status: 'Completed',
    priority: 'Low'
  }
];

// ── GET /tasks – Retrieve all tasks ────────────────────────────────────────
app.get('/tasks', (req, res) => {
  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// ── GET /tasks/:id – Retrieve a single task by ID ──────────────────────────
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with ID ${id} not found` });
  }

  res.status(200).json({ success: true, task });
});

// ── POST /tasks – Add a new task ────────────────────────────────────────────
app.post('/tasks', (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  // Validate required fields
  if (!id || !taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      error: 'Missing required fields: id, taskName, assignedTo, status, priority'
    });
  }

  // Check for duplicate ID
  const exists = tasks.find(t => t.id === id);
  if (exists) {
    return res.status(409).json({ error: `Task with ID ${id} already exists` });
  }

  const newTask = { id, taskName, assignedTo, status, priority };
  tasks.push(newTask);

  res.status(201).json({ message: 'Task added successfully', task: newTask });
});

// ── PUT /tasks/:id – Update a task ─────────────────────────────────────────
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${id} not found` });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  // Merge existing fields with updated fields
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...(taskName && { taskName }),
    ...(assignedTo && { assignedTo }),
    ...(status && { status }),
    ...(priority && { priority })
  };

  res.status(200).json({ message: 'Task updated successfully', task: tasks[taskIndex] });
});

// ── DELETE /tasks/:id – Delete a task ──────────────────────────────────────
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${id} not found` });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

// ── 404 – Invalid routes ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found', message: `Route ${req.url} does not exist` });
});

// ── Start server ────────────────────────────────────────────────────────────
app.listen(4000, () => {
  console.log('Express Server running at http://localhost:4000');
});
