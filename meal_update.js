const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Route to handle form submission
app.post('/update_meal', (req, res) => {
    const userid = req.body.userid;
    const password = req.body.password;
    const mealType = req.body.mealType;
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format

    // Simulate authentication (You should use a more secure authentication mechanism)
    if (userid === 'user' && password === 'password') {
        // Update SQL table
        const sql = `UPDATE meal_preferences 
                     SET ${mealType} = 1 
                     WHERE user_id = ? AND date = ?`;

        connection.query(sql, [userid, currentDate], (err, result) => {
            if (err) {
                console.error('Error updating record: ' + err);
                res.send('Error updating record');
            } else {
                console.log('Record updated successfully');
                res.send('Meal preference updated successfully');
            }
        });
    } else {
        res.send('Invalid username or password');
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// CREATE TABLE meal_preferences (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id VARCHAR(255),
//     date DATE,
//     breakfast INT DEFAULT 0,
//     lunch INT DEFAULT 0,
//     snacks INT DEFAULT 0,
//     dinner INT DEFAULT 0
// );
