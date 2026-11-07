# 🎓 Hemanth's Fee Management System

A modern, full-stack educational web application designed to streamline student fee management, track tuition dues, record payment transactions, and generate financial reports.

> **Project Author:** Hemanth  
> **GitHub Repository:** [hemanth5267/hemanths_fee_management_system](https://github.com/hemanth5267/hemanths_fee_management_system)  
> **Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Node.js, Express.js, MySQL

---

## 🌐 About the Website

**Hemanth's Fee Management System** (`hemanths_fee_management_system`) is an aesthetic, single-page web portal created for school administrators and accountants. It replaces paper ledgers and fragmented spreadsheets with a unified digital platform for real-time tracking of student fee commitments and collections.

### 🎨 Design & Aesthetic
- **Theme:** Deep Royal Blue (`#0a1628`) & Luxury Gold (`#f59e0b`) school palette.
- **Visual Illustrations:** Custom themed SVG hero banners on every section (School Campus, Graduation Students, Fee Invoicing, Payment Wallet, and Analytics Charts).
- **Admin Profile:** Features Hemanth's administrator portrait, status, and role in the primary navigation sidebar.
- **Student Avatars:** Integrated student photo gallery featuring custom themed vector avatars for students (Arjun, Priya, Rahul, Sneha, Vikram).
- **Interactive UI:** Smooth single-page navigation, responsive layout for desktop, tablet, and mobile, modal forms, and toast notifications.

---

## 🖥️ Website Sections & Capabilities

### 1. 📊 Interactive Dashboard
- **Live Financial Metric Cards:**
  - **Total Students Enrolled:** Active student count.
  - **Total Fees Assigned:** Total fee invoices issued.
  - **Total Collected:** Total payments cleared.
  - **Pending Amount:** Outstanding dues across all classes.
- **Collection Progress Bar:** Visual percentage gauge tracking fee realization against targets.
- **Recent Payments Ledger:** Real-time log of the latest transactions with student avatars, payment methods, and receipt IDs.

### 2. 👨‍🎓 Student Management
- **Student Directory:** Browse, search, and manage student records in real time.
- **Profile Details:** Student photo, Full Name, Class (e.g., `10-A`), Roll Number, Phone Number, and Email.
- **CRUD Controls:** Add new students, edit existing student profiles, and safely remove student records with cascading database integrity.

### 3. 📄 Fee Assignment
- **Custom Fee Allocation:** Assign specific fee types (`Tuition Fee`, `Transport Fee`, `Lab Fee`, `Sports Fee`, `Library Fee`, `Exam Fee`, `Miscellaneous`) per academic year.
- **Automated Balance Tracking:** Calculates `Total Amount`, `Paid Amount`, and remaining `Pending Amount` dynamically.
- **Status Badges:** Real-time status tags (`Paid`, `Partial`, or `Pending`) with due date alerts.

### 4. 💳 Payment Processing
- **Transaction Recording:** Log payments toward assigned fees with validation preventing overpayments.
- **Payment Modes:** Supports `Cash`, `Online`, `UPI`, `Cheque`, and `Demand Draft (DD)`.
- **Receipt Generator:** Auto-generates formal sequential receipt vouchers (e.g., `RCP-2025-001`).

### 5. 📑 Reports & Financial Statements
- **Individual Student Fee Statement:** Select any student to generate a comprehensive ledger showing profile information, all assigned fee heads, and complete payment transaction history.
- **Pending Payments Report:** Dedicated defaulters report listing all students with unpaid or partially paid fees alongside their due dates for proactive follow-ups.

---

## 🗄️ Database Architecture (`school_fee_db`)

The system runs on a relational MySQL database adhering to 3NF standards:

```
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│        students        │       │          fees          │       │        payments        │
├────────────────────────┤       ├────────────────────────┤       ├────────────────────────┤
│ student_id (PK)        │1     *│ fee_id (PK)            │1     *│ payment_id (PK)        │
│ name                   ├───────┤ student_id (FK)        ├───────┤ fee_id (FK)            │
│ class                  │       │ academic_year          │       │ amount_paid            │
│ rollno (UNIQUE)        │       │ fee_type               │       │ payment_date           │
│ phone                  │       │ total_amount           │       │ payment_method         │
│ email                  │       │ due_date               │       │ receipt_no (UNIQUE)    │
│ photo                  │       │ created_at             │       │ created_at             │
│ created_at             │       └────────────────────────┘       └────────────────────────┘
└────────────────────────┘
```

### Table Specifications

#### 1. `students`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `student_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique student identifier |
| `name` | VARCHAR(100) | NOT NULL | Full name of the student |
| `class` | VARCHAR(30) | NOT NULL | Class / Section (e.g., 10-A) |
| `rollno` | VARCHAR(30) | NOT NULL, UNIQUE | Roll number |
| `phone` | VARCHAR(15) | NULL | Guardian contact number |
| `email` | VARCHAR(100) | NULL | Email address |
| `photo` | VARCHAR(255) | NULL | Avatar/photo image path |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record registration timestamp |

#### 2. `fees`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `fee_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique fee entry ID |
| `student_id` | INT | NOT NULL, FOREIGN KEY | References `students(student_id)` |
| `academic_year` | VARCHAR(20) | NOT NULL | Academic session (e.g., 2025-2026) |
| `fee_type` | VARCHAR(50) | NOT NULL | Fee head (Tuition, Transport, etc.) |
| `total_amount` | DECIMAL(10,2)| NOT NULL | Total amount assessed (₹) |
| `due_date` | DATE | NOT NULL | Deadline for payment |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fee creation timestamp |

#### 3. `payments`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `payment_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique payment ID |
| `fee_id` | INT | NOT NULL, FOREIGN KEY | References `fees(fee_id)` |
| `amount_paid` | DECIMAL(10,2)| NOT NULL | Amount paid in transaction (₹) |
| `payment_date` | DATE | NOT NULL | Date of transaction |
| `payment_method`| VARCHAR(30) | NOT NULL | Cash / Online / UPI / Cheque / DD |
| `receipt_no` | VARCHAR(50) | NOT NULL, UNIQUE | Official receipt voucher code |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Transaction timestamp |

---

## ⚡ REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Retrieve all student records |
| `GET` | `/api/students/:id` | Retrieve single student by ID |
| `POST` | `/api/students` | Create a new student |
| `PUT` | `/api/students/:id` | Update an existing student |
| `DELETE` | `/api/students/:id` | Delete a student and cascade fees/payments |
| `GET` | `/api/fees` | Retrieve all fees with computed paid/pending balances |
| `GET` | `/api/fees/student/:studentId` | Retrieve fees assigned to a specific student |
| `POST` | `/api/fees` | Assign a new fee record |
| `PUT` | `/api/fees/:id` | Update fee terms or amount |
| `DELETE` | `/api/fees/:id` | Remove a fee record |
| `GET` | `/api/payments` | List all payment transactions |
| `POST` | `/api/payments` | Record a payment voucher |
| `DELETE` | `/api/payments/:id` | Void / delete a payment |
| `GET` | `/api/reports/dashboard` | Dashboard KPI summary statistics |
| `GET` | `/api/reports/student/:id` | Complete financial report for a student |
| `GET` | `/api/reports/pending` | List all outstanding/unpaid fee balances |

---

## 🚀 Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) & [MySQL Workbench](https://www.mysql.com/products/workbench/)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/hemanth5267/hemanths_fee_management_system.git
cd hemanths_fee_management_system
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Database
1. Open **MySQL Workbench**.
2. Connect to your local MySQL instance.
3. Open and run [`database.sql`](database.sql) to create `school_fee_db`, the three tables, and seed sample data.
4. Verify or adjust the connection credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=school_fee_db
   PORT=3000
   ```

### Step 4: Launch the Application
```bash
npm start
```
*(For auto-reloading during development, run `npm run dev`)*

### Step 5: Access the Website
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📂 Project Directory Structure

```
hemanths_fee_management_system/
├── public/
│   ├── css/
│   │   └── style.css            # Custom Deep Blue & Gold styling & responsive rules
│   ├── js/
│   │   └── app.js               # Frontend application logic & API fetch layer
│   ├── images/
│   │   ├── admin.png            # Hemanth Administrator photo
│   │   ├── banner-dashboard.svg # Campus hero illustration
│   │   ├── banner-students.svg  # Students hero illustration
│   │   ├── banner-fees.svg      # Invoicing hero illustration
│   │   ├── banner-payments.svg  # Payments hero illustration
│   │   ├── banner-reports.svg   # Reports & Analytics hero illustration
│   │   └── students/
│   │       ├── arjun.svg        # Student avatar (Arjun)
│   │       ├── priya.svg        # Student avatar (Priya)
│   │       ├── rahul.svg        # Student avatar (Rahul)
│   │       ├── sneha.svg        # Student avatar (Sneha)
│   │       └── vikram.svg       # Student avatar (Vikram)
│   └── index.html               # Main Single-Page Application interface
├── routes/
│   ├── students.js              # Student CRUD controller
│   ├── fees.js                  # Fee allocation controller
│   ├── payments.js              # Payment transactions controller
│   └── reports.js               # Financial reports controller
├── db.js                        # MySQL2 connection pool setup
├── server.js                    # Express application entry point
├── database.sql                 # Complete database schema and initial seed data
├── .env                         # Environment configuration
├── .gitignore                   # Git exclusions
├── package.json                 # Project dependencies and run scripts
└── README.md                    # Project documentation
```

---

## 👨‍💻 Author

**Hemanth**  
- **GitHub:** [@hemanth5267](https://github.com/hemanth5267)  
- **Project:** [Hemanth's Fee Management System](https://github.com/hemanth5267/hemanths_fee_management_system)  
- **License:** MIT
