// server/routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

const protect = require('../middleware/auth');

// GET /api/notes — return all notes for the logged-in user, pinned first
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notes/search?q= — search notes by title or content for user
router.get('/search', protect, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      const notes = await Note.find({ user: req.user.id }).sort({ isPinned: -1, createdAt: -1 });
      return res.json(notes);
    }
    const regex = new RegExp(query, 'i');
    const notes = await Note.find({
      user: req.user.id,
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } }
      ]
    }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notes — create new note
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    const note = new Note({
      user: req.user.id,
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false
    });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/notes/:id — update note
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content, tags, isPinned },
      { new: true, runValidators: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/notes/:id — delete note
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notes/:id/summarize — AI summary using Gemini
router.post('/:id/summarize', protect, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        message: 'Gemini API key not configured. Add GEMINI_API_KEY to your .env file.'
      });
    }

    console.log(`Sending API request to Gemini for note: ${note._id}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 sec timeout

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant. Summarize the following note in 2-3 concise sentences.\n\nTitle: ${note.title}\n\n${note.content}`
            }]
          }]
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        console.error('Gemini API Error:', data);
        return res.status(500).json({
          message: data.error?.message || 'Gemini API error'
        });
      }

      console.log(`Summary generated successfully for note: ${note._id}`);
      
      let summary = 'Failed to parse Gemini response.';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        summary = data.candidates[0].content.parts[0].text.trim();
      }
      
      res.json({ summary });
    } catch (fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        console.error('Gemini API timeout');
        return res.status(504).json({ message: 'Gemini API request timed out after 15 seconds' });
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('Summarize external error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
