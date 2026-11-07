const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all payments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, f.fee_type, f.academic_year, s.name AS student_name, s.rollno, s.class
            FROM payments p
            JOIN fees f ON p.fee_id = f.fee_id
            JOIN students s ON f.student_id = s.student_id
            ORDER BY p.payment_date DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET payment by fee_id
router.get('/fee/:feeId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM payments WHERE fee_id = ? ORDER BY payment_date DESC', [req.params.feeId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST record payment
router.post('/', async (req, res) => {
    try {
        const { fee_id, amount_paid, payment_date, payment_method, receipt_no } = req.body;
        if (!fee_id || !amount_paid || !payment_date || !payment_method || !receipt_no)
            return res.status(400).json({ success: false, message: 'All fields are required' });

        // Validate: don't overpay
        const [[fee]] = await db.query(`
            SELECT f.total_amount, COALESCE(SUM(p.amount_paid),0) AS paid
            FROM fees f LEFT JOIN payments p ON f.fee_id = p.fee_id
            WHERE f.fee_id = ? GROUP BY f.fee_id
        `, [fee_id]);
        if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
        const remaining = fee.total_amount - fee.paid;
        if (parseFloat(amount_paid) > remaining)
            return res.status(400).json({ success: false, message: `Amount exceeds pending balance of ₹${remaining.toFixed(2)}` });

        const [result] = await db.query(
            'INSERT INTO payments (fee_id, amount_paid, payment_date, payment_method, receipt_no) VALUES (?, ?, ?, ?, ?)',
            [fee_id, amount_paid, payment_date, payment_method, receipt_no]
        );
        res.json({ success: true, message: 'Payment recorded successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Receipt number already exists' });
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM payments WHERE payment_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Payment deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
