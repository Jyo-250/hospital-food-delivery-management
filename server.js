const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());


// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL user
    password: 'Jyo@2409', // Replace with your MySQL password
    database: 'hospital_food_manager'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to database');
});


// POST route to save patient details
app.post('/savePatientDetails', (req, res) => {
    const { name, diseases, allergies, room, bed, floor, age, gender, contact, emergency } = req.body;
    
    const query = 'INSERT INTO patient_details (name, diseases, allergies, room_number, bed_number, floor_number, age, gender, contact_info, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [name, diseases, allergies, room, bed, floor, age, gender, contact, emergency], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to save patient details' });
        } else {
            res.status(200).json({
                name, diseases, allergies, room, bed, floor, age, gender, contact, emergency
            });
        }
    });
});

// API endpoint to save diet chart
app.post('/saveDietChart', (req, res) => {
    const { mealTime, ingredients, instructions } = req.body;

    const query = 'INSERT INTO diet_chart (meal_time, ingredients, instructions) VALUES (?, ?, ?)';
    const values = [mealTime, ingredients, instructions];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving diet chart:', err);
            return res.status(500).json({ success: false, message: 'Error saving diet chart' });
        }
        console.log('Diet chart saved:', result);
        res.json({ success: true, message: 'Diet chart saved successfully' });
    });
});


// API endpoint to save pantry details
app.post('/savePantryDetails', (req, res) => {
    const { staffName, contactInfo, location } = req.body;

    const query = 'INSERT INTO pantry_details (staff_name, contact_info, location) VALUES (?, ?, ?)';
    const values = [staffName, contactInfo, location];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving pantry details:', err);
            return res.status(500).json({ success: false, message: 'Error saving pantry details' });
        }
        console.log('Pantry details saved:', result);
        res.json({ success: true, message: 'Pantry details saved successfully' });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});