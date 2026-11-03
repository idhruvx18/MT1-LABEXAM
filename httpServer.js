// Part A: HTTP Server Module - Node.js HTTP & FS Module
// Routes: /, /tasks, /about, /home, /add-task
// Port: 3000

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory task store for Part A
const tasks = [
  { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul Sharma', status: 'Pending' },
  { id: 2, taskName: 'Design Database Schema', assignedTo: 'Priya Mehta', status: 'In Progress' },
  { id: 3, taskName: 'Write Unit Tests', assignedTo: 'Arjun Verma', status: 'Completed' }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ── GET / ──────────────────────────────────────────────────────────────────
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Employee Task Management</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:40px;background:#f0f4ff">
          <h1 style="color:#1e3c72">Welcome to Employee Task Management</h1>
          <p>This application helps manage employee tasks efficiently.</p>
          <nav>
            <a href="/tasks">Tasks</a> |
            <a href="/about">About</a> |
            <a href="/home">Home Page</a>
          </nav>
        </body>
      </html>
    `);

  // ── GET /tasks ─────────────────────────────────────────────────────────────
  } else if (method === 'GET' && url === '/tasks') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, tasks }));

  // ── GET /about ─────────────────────────────────────────────────────────────
  } else if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      appName: 'Employee Task Management System',
      version: '1.0.0',
      description: 'A Node.js HTTP server application to manage employee tasks.',
      technologies: ['Node.js', 'HTTP Module', 'FS Module'],
      author: 'MT1 Lab Examination'
    }));

  // ── GET /home  (serve static HTML via FS module) ───────────────────────────
  } else if (method === 'GET' && url === '/home') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error reading file', details: err.message }));
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });

  // ── POST /add-task ─────────────────────────────────────────────────────────
  } else if (method === 'POST' && url === '/add-task') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const task = JSON.parse(body);
        const { id, taskName, assignedTo, status } = task;

        // Validate required fields
        if (!id || !taskName || !assignedTo || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Missing required fields: id, taskName, assignedTo, status'
          }));
          return;
        }

        tasks.push(task);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task added successfully', task }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });

  // ── 404 – Invalid Route ────────────────────────────────────────────────────
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '404 Not Found', message: `Route ${url} does not exist` }));
  }
});

server.listen(3000, () => {
  console.log('HTTP Server running at http://localhost:3000');
});

