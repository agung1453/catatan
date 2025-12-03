import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../models/note';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" (click)="cancel.emit()"></div>

      <!-- Modal Card -->
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <form [formGroup]="noteForm" (ngSubmit)="onSubmit()">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-800">
              @if (editingNote()) {
                Edit Catatan
              } @else {
                Catatan Baru
              }
            </h2>
            <button type="button" (click)="cancel.emit()" class="text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            
            <!-- Title Input -->
            <div class="space-y-1">
              <label for="title" class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Judul</label>
              <input 
                id="title"
                type="text" 
                formControlName="title"
                placeholder="Apa judul catatanmu?" 
                class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              >
              @if (noteForm.get('title')?.touched && noteForm.get('title')?.invalid) {
                <p class="text-red-500 text-xs mt-1">Judul wajib diisi</p>
              }
            </div>

            <!-- Category Select -->
            <div class="space-y-1">
               <label for="category" class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Kategori</label>
               <div class="flex flex-wrap gap-2 mt-1">
                 @for (cat of categories; track cat.value) {
                   <button 
                    type="button"
                    (click)="setCategory(cat.value)"
                    [class.ring-2]="noteForm.get('category')?.value === cat.value"
                    [class.ring-indigo-500]="noteForm.get('category')?.value === cat.value"
                    [class.bg-slate-100]="noteForm.get('category')?.value !== cat.value"
                    [class.text-slate-600]="noteForm.get('category')?.value !== cat.value"
                    [class.bg-indigo-50]="noteForm.get('category')?.value === cat.value"
                    [class.text-indigo-700]="noteForm.get('category')?.value === cat.value"
                    class="px-4 py-1.5 rounded-full text-sm font-medium border border-transparent transition-all"
                   >
                     {{ cat.label }}
                   </button>
                 }
               </div>
               <input type="hidden" formControlName="category">
            </div>

            <!-- Content Textarea -->
            <div class="space-y-1">
              <label for="content" class="text-xs font-semibold uppercase text-slate-500 tracking-wider">Isi Catatan</label>
              <textarea 
                id="content"
                formControlName="content"
                rows="6"
                placeholder="Tulis detail catatan di sini..."
                class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none"
              ></textarea>
              @if (noteForm.get('content')?.touched && noteForm.get('content')?.invalid) {
                <p class="text-red-500 text-xs mt-1">Isi catatan wajib diisi</p>
              }
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              (click)="cancel.emit()"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              [disabled]="noteForm.invalid"
              [class.opacity-50]="noteForm.invalid"
              [class.cursor-not-allowed]="noteForm.invalid"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Simpan Catatan
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class NoteFormComponent {
  editingNote = input<Note | null>(null);
  save = output<any>();
  cancel = output<void>();

  noteForm: FormGroup;
  
  categories = [
    { value: 'personal', label: 'Pribadi' },
    { value: 'work', label: 'Pekerjaan' },
    { value: 'idea', label: 'Ide' },
    { value: 'todo', label: 'Tugas' }
  ];

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category: ['personal', Validators.required]
    });

    effect(() => {
      const note = this.editingNote();
      if (note) {
        this.noteForm.patchValue({
          title: note.title,
          content: note.content,
          category: note.category
        });
      } else {
        this.noteForm.reset({ category: 'personal' });
      }
    });
  }

  setCategory(cat: string) {
    this.noteForm.patchValue({ category: cat });
  }

  onSubmit() {
    if (this.noteForm.valid) {
      this.save.emit(this.noteForm.value);
    }
  }
}