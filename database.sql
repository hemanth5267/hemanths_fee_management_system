-- ============================================================
--  Hemanth's Fee Management System — Database
--  South Indian Student Records & Complete Fee Setup
-- ============================================================

DROP DATABASE IF EXISTS school_fee_db;
CREATE DATABASE school_fee_db;
USE school_fee_db;

-- ──────────────────────────────────────
-- TABLE 1 : students
-- ──────────────────────────────────────
CREATE TABLE students (
    student_id  INT           NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)  NOT NULL,
    class       VARCHAR(30)   NOT NULL,
    rollno      VARCHAR(30)   NOT NULL UNIQUE,
    phone       VARCHAR(15),
    email       VARCHAR(100),
    photo       VARCHAR(255)  DEFAULT NULL,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id)
);

-- ──────────────────────────────────────
-- TABLE 2 : fees
-- ──────────────────────────────────────
CREATE TABLE fees (
    fee_id          INT            NOT NULL AUTO_INCREMENT,
    student_id      INT            NOT NULL,
    academic_year   VARCHAR(20)    NOT NULL,
    fee_type        VARCHAR(50)    NOT NULL,
    total_amount    DECIMAL(10,2)  NOT NULL,
    due_date        DATE           NOT NULL,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fee_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ──────────────────────────────────────
-- TABLE 3 : payments
-- ──────────────────────────────────────
CREATE TABLE payments (
    payment_id      INT            NOT NULL AUTO_INCREMENT,
    fee_id          INT            NOT NULL,
    amount_paid     DECIMAL(10,2)  NOT NULL,
    payment_date    DATE           NOT NULL,
    payment_method  VARCHAR(30)    NOT NULL,
    receipt_no      VARCHAR(50)    NOT NULL UNIQUE,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_id),
    FOREIGN KEY (fee_id) REFERENCES fees(fee_id) ON DELETE CASCADE
);

-- ──────────────────────────────────────
-- SAMPLE DATA (Authentic South Indian Names)
-- ──────────────────────────────────────

INSERT INTO students (name, class, rollno, phone, email, photo) VALUES
('Karthik Subramanian', '10-A', 'R001', '9876543210', 'karthik.subramanian@example.com', 'images/students/arjun.svg'),
('Priya Reddy',          '9-B',  'R002', '9876543211', 'priya.reddy@example.com',          'images/students/priya.svg'),
('Sai Krishna Rao',     '11-C', 'R003', '9876543212', 'saikrishna.rao@example.com',       'images/students/rahul.svg'),
('Ananya Iyer',         '10-B', 'R004', '9876543213', 'ananya.iyer@example.com',          'images/students/sneha.svg'),
('Vigneshwaran M.',     '12-A', 'R005', '9876543214', 'vigneshwaran.m@example.com',       'images/students/vikram.svg'),
('Meenakshi Sundaram',   '10-A', 'R006', '9876543215', 'meenakshi.s@example.com',          'images/students/priya.svg'),
('Praveen Naidu',        '9-A',  'R007', '9876543216', 'praveen.naidu@example.com',        'images/students/arjun.svg'),
('Keerthi Suresh',       '11-B', 'R008', '9876543217', 'keerthi.suresh@example.com',       'images/students/sneha.svg');

INSERT INTO fees (student_id, academic_year, fee_type, total_amount, due_date) VALUES
(1, '2025-2026', 'Tuition Fee',    15000.00, '2025-07-31'),
(1, '2025-2026', 'Transport Fee',   3000.00, '2025-07-31'),
(2, '2025-2026', 'Tuition Fee',    15000.00, '2025-07-31'),
(3, '2025-2026', 'Tuition Fee',    18000.00, '2025-07-31'),
(3, '2025-2026', 'Lab Fee',         2000.00, '2025-08-15'),
(4, '2025-2026', 'Tuition Fee',    15000.00, '2025-07-31'),
(4, '2025-2026', 'Library Fee',     1200.00, '2025-08-15'),
(5, '2025-2026', 'Tuition Fee',    20000.00, '2025-07-31'),
(5, '2025-2026', 'Sports Fee',      1500.00, '2025-08-15'),
(6, '2025-2026', 'Tuition Fee',    16000.00, '2025-07-31'),
(6, '2025-2026', 'Exam Fee',        2500.00, '2025-09-01'),
(7, '2025-2026', 'Tuition Fee',    14000.00, '2025-07-31'),
(7, '2025-2026', 'Transport Fee',   3500.00, '2025-07-31'),
(8, '2025-2026', 'Tuition Fee',    17500.00, '2025-07-31'),
(8, '2025-2026', 'Lab Fee',         2000.00, '2025-08-15');

INSERT INTO payments (fee_id, amount_paid, payment_date, payment_method, receipt_no) VALUES
(1,  10000.00, '2025-07-10', 'Online', 'RCP-2025-001'),
(2,   3000.00, '2025-07-10', 'Cash',   'RCP-2025-002'),
(3,  15000.00, '2025-07-12', 'Cheque', 'RCP-2025-003'),
(4,   8000.00, '2025-07-15', 'Online', 'RCP-2025-004'),
(8,  20000.00, '2025-07-20', 'DD',     'RCP-2025-005'),
(10, 16000.00, '2025-07-22', 'UPI',    'RCP-2025-006'),
(12, 10000.00, '2025-07-25', 'Online', 'RCP-2025-007'),
(14, 17500.00, '2025-07-28', 'Online', 'RCP-2025-008');
