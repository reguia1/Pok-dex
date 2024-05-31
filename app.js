const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'pokedex-db.ct6iawcuao0r.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'pokedex123',
    database: 'pokedex_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/pokemons', (req, res) => {
    const { name } = req.query;
    let query = 'SELECT * FROM Pokemon';
    if (name) {
        query += ` WHERE name LIKE '%${name}%'`;
    }
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.post('/pokemons', upload.single('image'), (req, res) => {
    const { name, type } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    db.query('INSERT INTO Pokemon (name, type, image) VALUES (?, ?, ?)', [name, type, image], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send('Pokemon added.');
        }
    });
});

app.delete('/pokemons/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Pokemon WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send('Pokemon deleted.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
