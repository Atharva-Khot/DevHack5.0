const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection configuration
const db = new Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "kamlesh@takhar",
    port: 5432,
});

// Connect to PostgreSQL
db.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL:', err.stack));

// Route to handle form submission and send coupon data
app.get('/couponData', (req, res) => {
    const couponQuery = `
        SELECT section, coupon_used, coupon_remaining FROM coupons
    `;

    db.query(couponQuery)
        .then(result => {
            // Send the coupon data as JSON response
            res.json(result.rows);
        })
        .catch(err => {
            console.error('Error fetching coupon data:', err);
            res.status(500).send('Error fetching coupon data');
        });
});

// Serve the EJS template
app.get('/', (req, res) => {
    // Fetch coupon data from the server
    db.query('SELECT section, coupon_used, coupon_remaining FROM coupons')
        .then(result => {
            // Render the EJS template and pass couponData to it
            res.render('coupons2.ejs', { couponData: result.rows });
        })
        .catch(err => {
            console.error('Error fetching coupon data:', err);
            res.status(500).send('Error fetching coupon data');
        });
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
