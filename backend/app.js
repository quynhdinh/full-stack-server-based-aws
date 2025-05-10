const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require("cors");

require('dotenv').config();
app.use(express.json());
app.use(cors())

// Configure the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database');
  }
});


app.post('/students/create-table', (req, res) => {
  const query = `CREATE TABLE student(id INT PRIMARY KEY, name VARCHAR(255) NOT NULL)`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Failed to create a table' });
    }
    res.json(results);
  });
});

app.post('/students', (req, res) => {
  const { id, name } = req.body;
  const query = `INSERT INTO student (id, name) VALUES (?, ?)`;

  // The second argument is an array of values that replace the placeholders
  const values = [id, name];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Failed to insert data' });
    }
    res.json(results);
  });
});
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM student WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Failed to delete student' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  });
});

app.get('/students', (req, res) => {
  const query = 'SELECT * FROM student';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ message: 'Failed to fetch students' });
    }
    res.json(results);
  });
});


// Start the server
const port = 6003;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
