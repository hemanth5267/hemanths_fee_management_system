const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Dashboard summary
router.get('/dashboard', async (req, res) => {
    try {
        const [[{ total_students }]] = await db.query('SELECT COUNT(*) AS total_students FROM students');
        const [[{ total_fees }]]    = await db.query('SELECT COALESCE(SUM(total_amount),0) AS total_fees FROM fees');
        const [[{ total_paid }]]    = await db.query('SELECT COALESCE(SUM(amount_paid),0) AS total_paid FROM payments');
        const pending = total_fees - total_paid;

        // Pending fee students count
        const [[{ pending_students }]] = await db.query(`
            SELECT COUNT(DISTINCT f.student_id) AS pending_students
            FROM fees f
            LEFT JOIN payments p ON f.fee_id = p.fee_id
            GROUP BY f.fee_id
            HAVING (f.total_amount - COALESCE(SUM(p.amount_paid),0)) > 0
        `).catch(() => [[{ pending_students: 0 }]]);

        // Recent payments
        const [recent_payments] = await db.query(`
            SELECT p.receipt_no, p.amount_paid, p.payment_date, p.payment_method,
                   s.name AS student_name, s.photo AS student_photo, f.fee_type
            FROM payments p
            JOIN fees f ON p.fee_id = f.fee_id
            JOIN students s ON f.student_id = s.student_id
            ORDER BY p.payment_date DESC LIMIT 5
        `);

        res.json({ success: true, data: { total_students, total_fees, total_paid, pending, recent_payments } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Student fee report
router.get('/student/:id', async (req, res) => {
    try {
        const [[student]] = await db.query('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const [fees] = await db.query(`
            SELECT f.*,
                   COALESCE(SUM(p.amount_paid),0) AS paid_amount,
                   (f.total_amount - COALESCE(SUM(p.amount_paid),0)) AS pending_amount
            FROM fees f
            LEFT JOIN payments p ON f.fee_id = p.fee_id
            WHERE f.student_id = ?
            GROUP BY f.fee_id
        `, [req.params.id]);

        const [payments] = await db.query(`
            SELECT p.*, f.fee_type FROM payments p
            JOIN fees f ON p.fee_id = f.fee_id
            WHERE f.student_id = ?
            ORDER BY p.payment_date DESC
        `, [req.params.id]);

        const total_fees   = fees.reduce((s, f) => s + parseFloat(f.total_amount), 0);
        const total_paid   = fees.reduce((s, f) => s + parseFloat(f.paid_amount), 0);
        const total_pending = total_fees - total_paid;

        res.json({ success: true, data: { student, fees, payments, total_fees, total_paid, total_pending } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Pending payments report
router.get('/pending', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.name, s.class, s.rollno, s.phone, s.photo AS student_photo,
                   f.fee_id, f.fee_type, f.academic_year, f.due_date, f.total_amount,
                   COALESCE(SUM(p.amount_paid),0) AS paid_amount,
                   (f.total_amount - COALESCE(SUM(p.amount_paid),0)) AS pending_amount
            FROM fees f
            JOIN students s ON f.student_id = s.student_id
            LEFT JOIN payments p ON f.fee_id = p.fee_id
            GROUP BY f.fee_id
            HAVING pending_amount > 0
            ORDER BY f.due_date ASC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
