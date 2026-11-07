# 🎓 Hemanth's Fee Management System

A full-stack web application to manage student fee details and payment records built with **HTML, CSS, JavaScript, Express.js and MySQL**.

> **Developed by: Hemanth** | GitHub: [hemanth5267](https://github.com/hemanth5267)

---

## ✨ Features

| Feature | Description |
|---|---|
| 👩‍🎓 Student Management | Add, edit, delete student records (name, class, roll no, phone, email) |
| 💰 Fee Assignment | Assign fees to students (Tuition, Transport, Lab, Sports, etc.) |
| 💳 Payment Recording | Record payments with receipt number, method & date |
| 📊 Reports | Student fee report + pending payments report |
| 📈 Dashboard | Live stats — total students, fees collected, pending amounts |
| 🖼️ Admin Photo | Upload your own photo in the sidebar |

---

## 🗄️ Database Schema

```
students       → student_id (PK), name, class, rollno, phone, email
fees           → fee_id (PK), student_id (FK), academic_year, fee_type, total_amount, due_date
payments       → payment_id (PK), fee_id (FK), amount_paid, payment_date, payment_method, receipt_no
```

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/hemanth5267/school-fee-management.git
cd school-fee-management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup MySQL Database
- Open **MySQL Workbench**
- Run the `database.sql` file to create the database and tables

### 4. Configure environment (already set)
The `.env` file is configured with:
```
DB_USER=root
DB_PASSWORD=root
DB_NAME=school_fee_db
PORT=3000
```

### 5. Start the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 6. Open the app
Visit → **http://localhost:3000**

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (custom, responsive), JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (via mysql2 driver)
- **Fonts/Icons**: Google Fonts (Inter), Font Awesome 6

---

## 📁 Project Structure

```
school-fee-management/
├── public/
│   ├── css/style.css        # All styles (Deep Blue & Gold theme)
│   ├── js/app.js            # Frontend logic
│   ├── images/              # Admin photo goes here
│   └── index.html           # Main SPA page
├── routes/
│   ├── students.js          # Student CRUD API
│   ├── fees.js              # Fee management API
│   ├── payments.js          # Payment recording API
│   └── reports.js           # Dashboard & reports API
├── db.js                    # MySQL connection pool
├── server.js                # Express app entry point
├── database.sql             # DB schema + sample data
├── .env                     # Environment variables
└── package.json
```

---

*Made with ❤️ by Hemanth*
