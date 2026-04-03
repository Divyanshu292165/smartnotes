// client/src/app/components/note-card/note-card.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css'
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();
  @Output() togglePin = new EventEmitter<Note>();
  @Output() summarize = new EventEmitter<Note>();

  summarizing = false;

  private tagColorPalette = [
    '#667eea', '#f093fb', '#4facfe', '#43e97b',
    '#fa709a', '#fee140', '#a18cd1', '#fbc2eb',
    '#ff9a9e', '#84fab0', '#fccb90', '#a1c4fd'
  ];

  getTagColor(tag: string): string {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.tagColorPalette.length;
    return this.tagColorPalette[index];
  }

  onEdit() {
    this.edit.emit(this.note);
  }

  onDelete() {
    if (confirm(`Delete "${this.note.title}"?`)) {
      this.delete.emit(this.note._id);
    }
  }

  onTogglePin() {
    this.togglePin.emit(this.note);
  }

  onSummarize() {
    this.summarizing = true;
    this.summarize.emit(this.note);
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getContentPreview(content: string): string {
    // Strip HTML tags for a clean text preview on cards
    const stripped = content.replace(/<[^>]*>/g, '');
    const truncated = stripped.length > 150 ? stripped.substring(0, 150) + '...' : stripped;
    return truncated;
  }
}
