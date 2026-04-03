// client/src/app/components/tag-filter/tag-filter.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-filter.component.html',
  styleUrl: './tag-filter.component.css'
})
export class TagFilterComponent {
  @Input() tags: string[] = [];
  @Input() selectedTag: string | null = null;
  @Output() tagSelected = new EventEmitter<string | null>();

  tagColors: { [key: string]: string } = {};

  private colorPalette = [
    '#667eea', '#f093fb', '#4facfe', '#43e97b',
    '#fa709a', '#fee140', '#a18cd1', '#fbc2eb',
    '#ff9a9e', '#84fab0', '#fccb90', '#a1c4fd'
  ];

  getTagColor(tag: string): string {
    if (!this.tagColors[tag]) {
      const index = Object.keys(this.tagColors).length % this.colorPalette.length;
      this.tagColors[tag] = this.colorPalette[index];
    }
    return this.tagColors[tag];
  }

  onSelectTag(tag: string | null) {
    this.tagSelected.emit(tag);
  }
}
