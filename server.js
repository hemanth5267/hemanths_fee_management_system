const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/fees',     require('./routes/fees'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reports',  require('./routes/reports'));

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\nHemanth's Fee Management System`);
    console.log(`Server running at http://localhost:${PORT}\n`);
});
