# SmartNotes 📝

A full-stack Smart Notes web application built with **Angular**, **Node.js/Express**, and **MongoDB**.

## Features

- ✅ **CRUD Notes** — Create, read, update, and delete notes
- 📌 **Pin/Unpin** — Pin important notes to the top
- 🏷️ **Tag System** — Add tags and filter notes by tag
- 🔍 **Live Search** — Real-time search by title or content
- 🌙 **Dark Mode** — Toggle with localStorage persistence
- ✨ **AI Summary** — Summarize notes using OpenAI API (optional)
- 📱 **Responsive** — Mobile-first responsive grid layout

## Prerequisites

- **Node.js** 18+
- **Angular CLI** (`npm install -g @angular/cli`)
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Project Structure

```
/smartnotes
  /client                  ← Angular frontend
    /src/app
      /components          ← header, note-card, note-editor, note-list, search-bar, tag-filter
      /services            ← notes.service.ts (HTTP calls)
      /models              ← note.model.ts (TypeScript interface)
  /server                  ← Node.js + Express backend
    /routes/notes.js       ← CRUD + search + summarize routes
    /models/Note.js        ← Mongoose schema
    server.js              ← Entry point
    .env                   ← Environment variables
```

## Setup

### 1. Backend

```bash
cd smartnotes/server
npm install
```

Create a `.env` file (one is already included with defaults):

```env
MONGO_URI=mongodb://localhost:27017/smartnotes
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here   # optional, for AI summary
```

Start the server:

```bash
node server.js
# or for auto-reload:
npx nodemon server.js
```

### 2. Frontend

```bash
cd smartnotes/client
npm install
ng serve
```

Open **http://localhost:4200** in your browser.

## API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/notes`              | Get all notes (pinned first) |
| POST   | `/api/notes`              | Create a new note            |
| PUT    | `/api/notes/:id`          | Update a note                |
| DELETE | `/api/notes/:id`          | Delete a note                |
| GET    | `/api/notes/search?q=`   | Search notes by title/content|
| POST   | `/api/notes/:id/summarize`| AI summarize a note          |

## Environment Variables

| Variable       | Required | Description                      |
|----------------|----------|----------------------------------|
| `MONGO_URI`    | Yes      | MongoDB connection string        |
| `PORT`         | No       | Server port (default: 5000)      |
| `OPENAI_API_KEY`| No      | OpenAI key for AI summary feature|

## Tech Stack

- **Frontend**: Angular 19+, TypeScript, Component-scoped CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **AI**: OpenAI GPT-3.5 Turbo (optional)
