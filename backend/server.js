const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dipti@2304',  // Update with your actual password
    database: 'bluestock',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check MySQL Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    } else {
        console.log("Connected to MySQL Database.");
        connection.release();
    }
});

// Signup Route
app.post('/signup', async (req, res) => {
    console.log("Received signup request:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into MySQL
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection error:", err);
                return res.status(500).json({ success: false, message: 'Database connection error' });
            }

            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            
            connection.query(query, [name, email, hashedPassword], (err, result) => {
                connection.release();

                if (err) {
                    console.error("Error inserting data:", err);
                    return res.status(500).json({ success: false, message: 'Error inserting data into database' });
                }

                console.log("User inserted:", result.insertId);
                res.status(200).json({ success: true, message: 'User created successfully' });
            });
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
