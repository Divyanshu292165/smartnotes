// client/src/app/components/note-editor/note-editor.component.ts
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent implements OnChanges {
  @Input() visible = false;
  @Input() noteToEdit: Note | null = null;
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() close = new EventEmitter<void>();

  title = '';
  content = '';
  tagsInput = '';

  // Quill toolbar configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['noteToEdit'] || changes['visible']) {
      if (this.noteToEdit) {
        this.title = this.noteToEdit.title;
        this.content = this.noteToEdit.content;
        this.tagsInput = this.noteToEdit.tags?.join(', ') || '';
      } else {
        this.resetForm();
      }
    }
  }

  get isEditing(): boolean {
    return !!this.noteToEdit;
  }

  get isContentEmpty(): boolean {
    if (!this.content) return true;
    // Strip HTML tags and check if remaining text is empty
    const stripped = this.content.replace(/<[^>]*>/g, '').trim();
    return stripped.length === 0;
  }

  onSave() {
    if (!this.title.trim() || this.isContentEmpty) return;

    const tags = this.tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const noteData: Partial<Note> = {
      title: this.title.trim(),
      content: this.content,
      tags
    };

    if (this.noteToEdit?._id) {
      noteData._id = this.noteToEdit._id;
      noteData.isPinned = this.noteToEdit.isPinned;
    }

    this.save.emit(noteData);
    this.resetForm();
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  private resetForm() {
    this.title = '';
    this.content = '';
    this.tagsInput = '';
  }
}
