import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-shared-note-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shared-note-view.component.html',
  styleUrl: './shared-note-view.component.css'
})
export class SharedNoteViewComponent implements OnInit {
  note: Note | null = null;
  error: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private notesService: NotesService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.error = 'Invalid share link.';
      this.loading = false;
      return;
    }

    this.notesService.getSharedNote(token).subscribe({
      next: (note) => {
        this.note = note;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Note not found or sharing has been disabled.';
        this.loading = false;
      }
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  }
}
