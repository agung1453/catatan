import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from './services/note.service';
import { NoteCardComponent } from './components/note-card.component';
import { NoteFormComponent } from './components/note-form.component';
import { Note } from './models/note';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, NoteFormComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private noteService = inject(NoteService);
  
  // State for UI
  showForm = signal(false);
  editingNote = signal<Note | null>(null);
  searchQuery = signal('');
  selectedCategoryFilter = signal<string | null>(null);

  // Derived state for filtered notes
  filteredNotes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.selectedCategoryFilter();
    let notes = this.noteService.notes();

    if (cat) {
      notes = notes.filter(n => n.category === cat);
    }

    if (query) {
      notes = notes.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.content.toLowerCase().includes(query)
      );
    }

    return notes;
  });

  // Actions
  handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  setFilter(category: string | null) {
    this.selectedCategoryFilter.set(category);
  }

  openCreateForm() {
    this.editingNote.set(null);
    this.showForm.set(true);
  }

  openEditForm(note: Note) {
    this.editingNote.set(note);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingNote.set(null);
  }

  handleSave(formValue: any) {
    const currentEdit = this.editingNote();
    if (currentEdit) {
      this.noteService.updateNote(currentEdit.id, formValue);
    } else {
      this.noteService.addNote(formValue);
    }
    this.closeForm();
  }

  handleDelete(id: string) {
    if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      this.noteService.deleteNote(id);
    }
  }

  downloadJson() {
    this.noteService.downloadData();
  }
}