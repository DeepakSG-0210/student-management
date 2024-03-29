// server.js
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json()); // middleware to parse JSON bodies

// Create a new student
app.post('/students', async (req, res) => {
    try {
        const { name, age, grade } = req.body;
        const newStudent = await pool.query(
            "INSERT INTO students (name, age, grade) VALUES ($1, $2, $3) RETURNING *",
            [name, age, grade]
        );
        res.json(newStudent.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Read all students
app.get('/students', async (req, res) => {
    try {
        const allStudents = await pool.query("SELECT * FROM students");
        res.json(allStudents.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Update a student's data
app.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, grade } = req.body;
        await pool.query(
            "UPDATE students SET name = $1, age = $2, grade = $3 WHERE id = $4",
            [name, age, grade, id]
        );
        res.json("Student was updated successfully.");
    } catch (err) {
        console.error(err.message);
    }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM students WHERE id = $1", [id]);
        res.json("Student was deleted successfully.");
    } catch (err) {
        console.error(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
