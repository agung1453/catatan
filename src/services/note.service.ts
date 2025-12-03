import { Injectable, signal, computed, effect } from '@angular/core';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly STORAGE_KEY = 'applet-notes-data';
  
  // State managed by signals
  private notesSignal = signal<Note[]>([]);

  // Derived state for sorting
  readonly notes = computed(() => {
    return this.notesSignal().sort((a, b) => b.updatedAt - a.updatedAt);
  });

  constructor() {
    this.loadNotes();
    
    // Auto-save effect whenever notes change
    effect(() => {
      this.saveNotesToStorage(this.notesSignal());
    });
  }

  private loadNotes() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.notesSignal.set(JSON.parse(saved));
      } catch (e) {
        console.error('Gagal memuat data', e);
        this.initializeDefaultData();
      }
    } else {
      this.initializeDefaultData();
    }
  }

  private initializeDefaultData() {
    const defaults: Note[] = [
      {
        id: '1',
        title: 'Selamat Datang!',
        content: 'Ini adalah aplikasi catatan sederhana. Anda bisa membuat, mengubah, dan menghapus catatan. Data tersimpan di browser Anda.',
        category: 'personal',
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: '2',
        title: 'Ide Proyek Baru',
        content: 'Membuat aplikasi AI menggunakan Gemini API dan Angular terbaru.',
        category: 'idea',
        createdAt: Date.now() - 100000,
        updatedAt: Date.now() - 100000
      }
    ];
    this.notesSignal.set(defaults);
  }

  private saveNotesToStorage(notes: Note[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.notesSignal.update(notes => [newNote, ...notes]);
  }

  updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) {
    this.notesSignal.update(notes => 
      notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)
    );
  }

  deleteNote(id: string) {
    this.notesSignal.update(notes => notes.filter(n => n.id !== id));
  }
  
  // Simulate downloading data.json
  downloadData() {
    const dataStr = JSON.stringify(this.notesSignal(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}