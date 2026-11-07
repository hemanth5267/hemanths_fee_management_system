-- ============================================================
--  School Fee Management System — Database Setup
--  Author: Hemanth
-- ============================================================

CREATE DATABASE IF NOT EXISTS school_fee_db;
USE school_fee_db;

-- Table 1: Students
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    class      VARCHAR(30)  NOT NULL,
    rollno     VARCHAR(30)  NOT NULL UNIQUE,
    phone      VARCHAR(15),
    email      VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Fees
CREATE TABLE IF NOT EXISTS fees (
    fee_id        INT AUTO_INCREMENT PRIMARY KEY,
    student_id    INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    fee_type      VARCHAR(50) NOT NULL,
    total_amount  DECIMAL(10,2) NOT NULL,
    due_date      DATE NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Table 3: Payments
CREATE TABLE IF NOT EXISTS payments (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    fee_id         INT NOT NULL,
    amount_paid    DECIMAL(10,2) NOT NULL,
    payment_date   DATE NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    receipt_no     VARCHAR(50) NOT NULL UNIQUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fee_id) REFERENCES fees(fee_id) ON DELETE CASCADE
);

-- ============================================================
--  Sample Data
-- ============================================================

INSERT INTO students (name, class, rollno, phone, email) VALUES
('Arjun Sharma',  '10-A', 'R001', '9876543210', 'arjun@example.com'),
('Priya Reddy',   '9-B',  'R002', '9876543211', 'priya@example.com'),
('Rahul Kumar',   '11-C', 'R003', '9876543212', 'rahul@example.com'),
('Sneha Patel',   '10-B', 'R004', '9876543213', 'sneha@example.com'),
('Vikram Singh',  '12-A', 'R005', '9876543214', 'vikram@example.com');

INSERT INTO fees (student_id, academic_year, fee_type, total_amount, due_date) VALUES
(1, '2025-2026', 'Tuition Fee',   15000.00, '2025-07-31'),
(1, '2025-2026', 'Transport Fee',  3000.00, '2025-07-31'),
(2, '2025-2026', 'Tuition Fee',   15000.00, '2025-07-31'),
(3, '2025-2026', 'Tuition Fee',   18000.00, '2025-07-31'),
(3, '2025-2026', 'Lab Fee',        2000.00, '2025-08-15'),
(4, '2025-2026', 'Tuition Fee',   15000.00, '2025-07-31'),
(5, '2025-2026', 'Tuition Fee',   20000.00, '2025-07-31'),
(5, '2025-2026', 'Sports Fee',     1500.00, '2025-08-15');

INSERT INTO payments (fee_id, amount_paid, payment_date, payment_method, receipt_no) VALUES
(1, 10000.00, '2025-07-10', 'Online', 'RCP-2025-001'),
(2,  3000.00, '2025-07-10', 'Cash',   'RCP-2025-002'),
(3, 15000.00, '2025-07-12', 'Cheque', 'RCP-2025-003'),
(4,  8000.00, '2025-07-15', 'Online', 'RCP-2025-004'),
(7, 20000.00, '2025-07-20', 'DD',     'RCP-2025-005');
