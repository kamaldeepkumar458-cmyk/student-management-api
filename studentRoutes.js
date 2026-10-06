const express = require('express');
const router = express.Router();
let students = require('../data/students');

// 1. GET /students - Fetch all students
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// 2. GET /students/:id - Fetch a single student by ID
router.get('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// 3. POST /students - Create a new student
router.post('/', (req, res) => {
  const { name, age, course } = req.body;

  // Validation: Check for required fields
  if (!name || !age || !course) {
    return res.status(400).json({
      success: false,
      message: "Please provide 'name', 'age', and 'course'."
    });
  }

  // Generate unique incremental ID
  const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

  const newStudent = {
    id: newId,
    name: name.trim(),
    age: Number(age),
    course: course.trim()
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student record created successfully.",
    data: newStudent
  });
});

// 4. PUT /students/:id - Update an existing student
router.put('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  const { name, age, course } = req.body;

  // Validation: At least one field should be provided to update
  if (!name && !age && !course) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update ('name', 'age', or 'course')."
    });
  }

  // Update existing fields or retain current values
  students[studentIndex] = {
    ...students[studentIndex],
    ...(name && { name: name.trim() }),
    ...(age && { age: Number(age) }),
    ...(course && { course: course.trim() })
  };

  res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} updated successfully.`,
    data: students[studentIndex]
  });
});

// 5. DELETE /students/:id - Delete a student
router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} removed successfully.`,
    data: deletedStudent
  });
});

module.exports = router;