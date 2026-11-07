const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all students
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single student
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create student
router.post('/', async (req, res) => {
    try {
        const { name, class: cls, rollno, phone, email } = req.body;
        if (!name || !cls || !rollno) return res.status(400).json({ success: false, message: 'Name, class, and rollno are required' });
        const [result] = await db.query(
            'INSERT INTO students (name, class, rollno, phone, email) VALUES (?, ?, ?, ?, ?)',
            [name, cls, rollno, phone, email]
        );
        res.json({ success: true, message: 'Student added successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Roll number already exists' });
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    try {
        const { name, class: cls, rollno, phone, email } = req.body;
        await db.query(
            'UPDATE students SET name=?, class=?, rollno=?, phone=?, email=? WHERE student_id=?',
            [name, cls, rollno, phone, email, req.params.id]
        );
        res.json({ success: true, message: 'Student updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
