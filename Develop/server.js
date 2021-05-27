const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

const notes = require('./db/db.json'); 

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/api/notes', (req, res) => {
  
    return res.json(notes);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    notes.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes }, null, 2)
      );
    res.json(notes);
  });

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});