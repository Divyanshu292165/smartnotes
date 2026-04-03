// client/src/app/models/note.model.ts
export interface Note {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt?: string;
  updatedAt?: string;
  summary?: string;
}
