const express = require('express');
const logger = require('./middleware/logger');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in middleware to parse incoming JSON bodies
app.use(express.json());

// Custom Logger Middleware applied globally
app.use(logger);

// Mount modular student routes
app.use('/students', studentRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Student Management API is running. Access endpoints via /students"
  });
});

// Catch-all 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server."
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});