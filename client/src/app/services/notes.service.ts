// client/src/app/services/notes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'https://smartnotes-yuwt.onrender.com/api/notes';

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchNotes(query: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  summarizeNote(id: string): Observable<{ summary: string }> {
    return this.http.post<{ summary: string }>(`${this.apiUrl}/${id}/summarize`, {});
  }

  shareNote(id: string): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/share`, {});
  }

  getSharedNote(token: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/shared/${token}`);
  }
}
