import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Note } from '../models/note';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col h-full">
      
      <!-- Category Badge -->
      <div class="absolute top-4 right-4 z-10">
        <span [class]="getCategoryClass(note().category)" class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize tracking-wide">
          {{ note().category }}
        </span>
      </div>

      <div class="p-6 flex-grow">
        <h3 class="text-lg font-bold text-slate-800 mb-2 pr-16 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {{ note().title }}
        </h3>
        
        <p class="text-slate-500 text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap">
          {{ note().content }}
        </p>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span class="text-xs text-slate-400 font-medium">
          {{ note().updatedAt | date:'d MMM, HH:mm' }}
        </span>

        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            (click)="onEdit.emit(note())"
            class="p-2 rounded-full text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
            title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          
          <button 
            (click)="onDelete.emit(note().id)"
            class="p-2 rounded-full text-slate-500 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all"
            title="Hapus">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class NoteCardComponent {
  note = input.required<Note>();
  onEdit = output<Note>();
  onDelete = output<string>();

  getCategoryClass(category: string): string {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-700';
      case 'personal': return 'bg-green-100 text-green-700';
      case 'idea': return 'bg-amber-100 text-amber-700';
      case 'todo': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}