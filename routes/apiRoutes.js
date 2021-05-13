const router = require('express').Router();
const SavedNotes = require('../db/savedNotes.js');

router.get("/notes", (req, res) => {
    SavedNotes
    .getNotes()
    .then((notes) => {
        return res.json(notes);
    })
    .catch((err) => res.status(500).json(err)); 
});

router.post("/notes", (req, res) => {
    SavedNotes
    .saveNote(req.body)
    .then((note) => res.json(note))
    .catch((err) => res.status(500).json(err));
});

router.delete("/notes/:id", (req, res) => {
    SavedNotes
    .deleteNote(req.params.id)
    .then(() => res.json({ok: true}))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;