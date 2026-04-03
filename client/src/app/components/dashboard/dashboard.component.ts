import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';
import { HeaderComponent } from '../header/header.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { TagFilterComponent } from '../tag-filter/tag-filter.component';
import { NoteListComponent } from '../note-list/note-list.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SearchBarComponent,
    TagFilterComponent,
    NoteListComponent,
    NoteEditorComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  allTags: string[] = [];
  selectedTag: string | null = null;
  searchTerm = '';
  darkMode = false;
  editorVisible = false;
  noteToEdit: Note | null = null;

  constructor(private notesService: NotesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDarkMode();
    this.loadNotes();
  }

  // ----- Data Loading -----
  loadNotes() {
    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.extractTags();
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load notes:', err)
    });
  }

  extractTags() {
    const tagSet = new Set<string>();
    this.notes.forEach(note => {
      note.tags?.forEach(tag => tagSet.add(tag));
    });
    this.allTags = Array.from(tagSet).sort();
  }

  applyFilters() {
    let result = [...this.notes];

    // Filter by tag
    if (this.selectedTag) {
      result = result.filter(n => n.tags?.includes(this.selectedTag!));
    }

    // Filter by search term (client-side)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term)
      );
    }

    this.filteredNotes = result;
    this.cdr.detectChanges();
  }

  // ----- Search -----
  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  // ----- Tag Filter -----
  onTagSelected(tag: string | null) {
    this.selectedTag = tag;
    this.applyFilters();
  }

  // ----- CRUD Operations -----
  openNewNote() {
    this.noteToEdit = null;
    this.editorVisible = true;
    this.cdr.detectChanges();
  }

  onEditNote(note: Note) {
    this.noteToEdit = { ...note };
    this.editorVisible = true;
    this.cdr.detectChanges();
  }

  onSaveNote(noteData: Partial<Note>) {
    if (noteData._id) {
      // Update existing
      this.notesService.updateNote(noteData._id, noteData).subscribe({
        next: () => {
          this.editorVisible = false;
          this.noteToEdit = null;
          this.loadNotes();
        },
        error: (err) => console.error('Failed to update note:', err)
      });
    } else {
      // Create new
      this.notesService.createNote(noteData).subscribe({
        next: () => {
          this.editorVisible = false;
          this.loadNotes();
        },
        error: (err) => console.error('Failed to create note:', err)
      });
    }
  }

  onDeleteNote(id: string) {
    this.notesService.deleteNote(id).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Failed to delete note:', err)
    });
  }

  onTogglePin(note: Note) {
    this.notesService.updateNote(note._id!, { isPinned: !note.isPinned }).subscribe({
      next: () => this.loadNotes(),
      error: (err) => console.error('Failed to toggle pin:', err)
    });
  }

  onSummarizeNote(note: Note) {
    this.notesService.summarizeNote(note._id!).subscribe({
      next: (res) => {
        const idx = this.notes.findIndex(n => n._id === note._id);
        if (idx !== -1) {
          this.notes[idx].summary = res.summary;
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Failed to summarize:', err);
        const idx = this.notes.findIndex(n => n._id === note._id);
        if (idx !== -1) {
          this.notes[idx].summary = 'Failed to generate summary. Please check your Gemini API key.';
          this.applyFilters();
        }
      }
    });
  }

  onShareNote(note: Note) {
    this.notesService.shareNote(note._id!).subscribe({
      next: (updatedNote) => {
        // Update local reference to show it's shared
        const idx = this.notes.findIndex(n => n._id === note._id);
        if (idx !== -1) {
          this.notes[idx].isShared = true;
          this.notes[idx].shareToken = updatedNote.shareToken;
          this.applyFilters();
        }

        // Generate public link
        const shareLink = `${window.location.origin}/shared/${updatedNote.shareToken}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareLink).then(() => {
          alert('Public link copied to clipboard!\n\n' + shareLink);
        }).catch(err => {
          console.error('Failed to copy to clipboard', err);
          alert('Note is shared! Public link:\n' + shareLink);
        });
      },
      error: (err) => console.error('Failed to share note:', err)
    });
  }

  closeEditor() {
    this.editorVisible = false;
    this.noteToEdit = null;
    this.cdr.detectChanges();
  }

  // ----- Dark Mode -----
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('smartnotes-dark-mode', JSON.stringify(this.darkMode));
    this.cdr.detectChanges();
  }

  private loadDarkMode() {
    const stored = localStorage.getItem('smartnotes-dark-mode');
    if (stored) {
      this.darkMode = JSON.parse(stored);
    }
  }
}
