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

// Route to handle form submission
// app.post('/update_meal', (req, res) => {
//     const userid = req.body.userid;
//     const password = req.body.password;
//     const mealType = req.body.mealType;
//     const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format

//     // Simulate authentication (You should use a more secure authentication mechanism)
//     if (userid === 'user' && password === 'password') {
//         // Update SQL table
//         const sql = `UPDATE meal_preferences 
//                      SET ${mealType} = 1 
//                      WHERE user_id = $1 AND date = $2`;

//         db.query(sql, [userid, currentDate], (err, result) => {
//             if (err) {
//                 console.error('Error updating record:', err);
//                 res.send('Error updating record');
//             } else {
//                 console.log('Record updated successfully');
//                 res.send('Meal preference updated successfully');
//             }
//         });
//     } else {
//         res.send('Invalid username or password');
//     }
// });

// app.post('/update_meal', (req, res) => {
//     const userid = req.body.userid;
//     const mealType = req.body.mealType;
//     const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format

//     // Check if the record exists
//     const selectQuery = `
//         SELECT id FROM meal_preferences
//         WHERE user_id = $1 AND date = $2
//     `;

//     db.query(selectQuery, [userid, currentDate], (err, result) => {
//         if (err) {
//             console.error('Error checking record:', err);
//             res.send('Error checking record');
//             return;
//         }

//         if (result.rows.length > 0) {
//             // Record exists, update the meal field
//             const updateQuery = `
//                 UPDATE meal_preferences
//                 SET ${mealType} = 1
//                 WHERE user_id = $1 AND date = $2
//             `;
//             db.query(updateQuery, [userid, currentDate], (err, result) => {
//                 if (err) {
//                     console.error('Error updating record:', err);
//                     res.send('Error updating record');
//                 } else {
//                     console.log('Record updated successfully');
//                     res.send('Meal preference updated successfully');
//                 }
//             });
//         } else {
//             // Record doesn't exist, insert a new record
//             const insertQuery = `
//                 INSERT INTO meal_preferences (user_id, date, ${mealType})
//                 VALUES ($1, $2, 1)
//             `;
//             db.query(insertQuery, [userid, currentDate], (err, result) => {
//                 if (err) {
//                     console.error('Error inserting record:', err);
//                     res.send('Error inserting record');
//                 } else {
//                     console.log('New record inserted successfully');
//                     res.send('New meal preference inserted successfully');
//                 }
//             });
//         }
//     });
// });


app.post('/update_meal', (req, res) => {
    const userid = req.body.userid;
    const mealType = req.body.mealType;
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format

    // Check if the record exists in meal_preferences table
    const selectQuery = `
        SELECT id FROM meal_preferences
        WHERE user_id = $1 AND date = $2
    `;

    db.query(selectQuery, [userid, currentDate], (err, result) => {
        if (err) {
            console.error('Error checking meal record:', err);
            res.send('Error checking meal record');
            return;
        }

        if (result.rows.length > 0) {
            // Record exists, update the meal field in meal_preferences table
            const updateQuery = `
                UPDATE meal_preferences
                SET ${mealType} = 1
                WHERE user_id = $1 AND date = $2
            `;
            db.query(updateQuery, [userid, currentDate], (err, result) => {
                if (err) {
                    console.error('Error updating meal record:', err);
                    res.send('Error updating meal record');
                } else {
                    console.log('Meal record updated successfully');

                    // Update the coupons table
                    const couponUpdateQuery = `
                        UPDATE coupons
                        SET coupon_used = coupon_used + 1,
                            coupon_remaining = coupon_remaining - 1
                        WHERE section = $1
                    `;
                    db.query(couponUpdateQuery, [mealType], (err, result) => {
                        if (err) {
                            console.error('Error updating coupons:', err);
                            res.send('Error updating coupons');
                        } else {
                            console.log('Coupons updated successfully');
                            res.send('Meal preference and coupons updated successfully');
                        }
                    });
                }
            });
        } else {
            // Record doesn't exist, insert a new record in meal_preferences table
            const insertQuery = `
                INSERT INTO meal_preferences (user_id, date, ${mealType})
                VALUES ($1, $2, 1)
            `;
            db.query(insertQuery, [userid, currentDate], (err, result) => {
                if (err) {
                    console.error('Error inserting meal record:', err);
                    res.send('Error inserting meal record');
                } else {
                    console.log('New meal record inserted successfully');
                    res.send('New meal preference inserted successfully');

                    // Update the coupons table
                    const couponUpdateQuery = `
                        UPDATE coupons
                        SET coupon_used = coupon_used + 1,
                            coupon_remaining = coupon_remaining - 1
                        WHERE section = $1
                    `;
                    db.query(couponUpdateQuery, [mealType], (err, result) => {
                        if (err) {
                            console.error('Error updating coupons:', err);
                        } else {
                            console.log('Coupons updated successfully');
                        }
                    });
                }
            });
        }
    });
});



// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/meal2.html');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
