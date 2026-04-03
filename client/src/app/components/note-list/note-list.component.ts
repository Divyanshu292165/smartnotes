// client/src/app/components/note-list/note-list.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteCardComponent } from '../note-card/note-card.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, NoteCardComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Output() editNote = new EventEmitter<Note>();
  @Output() deleteNote = new EventEmitter<string>();
  @Output() togglePin = new EventEmitter<Note>();
  @Output() summarizeNote = new EventEmitter<Note>();
  @Output() shareNote = new EventEmitter<Note>();

  onEdit(note: Note) {
    this.editNote.emit(note);
  }

  onDelete(id: string) {
    this.deleteNote.emit(id);
  }

  onTogglePin(note: Note) {
    this.togglePin.emit(note);
  }

  onSummarize(note: Note) {
    this.summarizeNote.emit(note);
  }

  onShare(note: Note) {
    this.shareNote.emit(note);
  }
}
