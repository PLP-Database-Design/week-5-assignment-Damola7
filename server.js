// Import some dependencies/ packages 

// HTTP framework for handling requests
const express = require('express');
//Instance of express framework
const app = express(); 
// DBMS Mysql 
const mysql = require('mysql2');
// Cross Origin Resourse Sharing 
const cors = require('cors');
// Environment variable doc 
const dotenv = require('dotenv'); 

// 
app.use(express.json());
app.use(cors());
dotenv.config(); 

// connection to the database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Check if there is a connection 
db.connect((err) => {
    // If no connection 
    if(err) return console.log("Error connecting to MYSQL", err.message);

    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId); 
}) 

// < YOUR code goes down here 

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Data is a file found in the Views folder 
// QUESTION 1
app.get('/patients', (req, res) => {
    const patients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query (patients, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error retrieving patients'});
        } else {
            res.render('data', {results: results});
        }
      });
});

//QUESTION 2
app.get('/providers', (req, res) => {
    const providers = 'SELECT provider_id, first_name, last_name, provider_specialty FROM providers';
    db.query(providers, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error retrieving providers' });
        } else {
            res.render('providers', { results: results });
        }
    });
});

//QUESTION 3
app.get('/patients/:first_name', (req, res) => {
    const firstName = req.params.first_name
    const sql = 'SELECT first_name, last_name FROM patients WHERE first_name = ?';
    db.query (sql, [firstName], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error retrieving patients by first name'});
        } else {
            res.render('patients', {results: results});
        }
      });
});

//QUESTION 4
app.get('/providers/:provider_specialty', (req, res) => {
    const specialty = req.params.provider_specialty
    console.log('Requested Specialty:', specialty);  // Debugging log

    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?'
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error retrieving providers by specialty' });
        } else {
            res.render('providers-specialty', { results: results });
        }
    });
});

// <Your code goes up there

// Start the server 
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser 
    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});