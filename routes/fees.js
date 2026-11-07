const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all fees (with student name)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.*, s.name AS student_name, s.class, s.rollno, s.photo AS student_photo,
                   COALESCE(SUM(p.amount_paid),0) AS paid_amount,
                   (f.total_amount - COALESCE(SUM(p.amount_paid),0)) AS pending_amount
            FROM fees f
            JOIN students s ON f.student_id = s.student_id
            LEFT JOIN payments p ON f.fee_id = p.fee_id
            GROUP BY f.fee_id
            ORDER BY f.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET fees for a specific student
router.get('/student/:studentId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.*,
                   COALESCE(SUM(p.amount_paid),0) AS paid_amount,
                   (f.total_amount - COALESCE(SUM(p.amount_paid),0)) AS pending_amount
            FROM fees f
            LEFT JOIN payments p ON f.fee_id = p.fee_id
            WHERE f.student_id = ?
            GROUP BY f.fee_id
            ORDER BY f.due_date ASC
        `, [req.params.studentId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST assign fee
router.post('/', async (req, res) => {
    try {
        const { student_id, academic_year, fee_type, total_amount, due_date } = req.body;
        if (!student_id || !academic_year || !fee_type || !total_amount || !due_date)
            return res.status(400).json({ success: false, message: 'All fields are required' });
        const [result] = await db.query(
            'INSERT INTO fees (student_id, academic_year, fee_type, total_amount, due_date) VALUES (?, ?, ?, ?, ?)',
            [student_id, academic_year, fee_type, total_amount, due_date]
        );
        res.json({ success: true, message: 'Fee assigned successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT update fee
router.put('/:id', async (req, res) => {
    try {
        const { academic_year, fee_type, total_amount, due_date } = req.body;
        await db.query(
            'UPDATE fees SET academic_year=?, fee_type=?, total_amount=?, due_date=? WHERE fee_id=?',
            [academic_year, fee_type, total_amount, due_date, req.params.id]
        );
        res.json({ success: true, message: 'Fee updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE fee
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM fees WHERE fee_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Fee deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
