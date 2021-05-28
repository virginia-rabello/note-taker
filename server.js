const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

const {notes} = require('db/db.json'); 

function createNewNote(body, notesArray){
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, 'db/db.json'),
        JSON.stringify({ notes }, null, 2)
      );
    return note;
}

function findNoteIndex(id, notesArray){
    for(let i=0; i<notesArray.length; i++){
        if(notesArray[i].id === id){
            return i;
        }
    }
}

function deleteNote(id, notesArray){
    let index = findNoteIndex(id,notesArray);
    notesArray.splice(index, 1);
    fs.writeFileSync(
        path.join(__dirname, 'db/db.json'),
        JSON.stringify({ notes }, null, 2)
      );
     return id;
}

function validateNote(note){
    if (!note.title || typeof note.title !== 'string') {
        return false;
      }
    if (!note.text || typeof note.text !== 'string') {
    return false;
      }  
    return true; 
}

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  
    return res.json(notes);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    req.body.id = crypto.randomBytes(16).toString("hex");
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formated.');
      } else {
        const newNote = createNewNote(req.body, notes);
        res.json(newNote);
      }
  });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;
    if (!noteId) {
        res.status(400).send('It was not possible delete this note.');
      } else {
        res.json(deleteNote(noteId, notes));
     }
  
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});