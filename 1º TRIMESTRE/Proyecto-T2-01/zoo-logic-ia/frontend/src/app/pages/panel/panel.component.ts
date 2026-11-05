import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZooApiService } from '../../core/zoo-api.service';
import { Animal, AnimalStats, Species, VetRecord } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, RevealDirective],
  templateUrl: './panel.component.html'
})
export class PanelComponent implements OnInit {
  private readonly api = inject(ZooApiService);
  private readonly fb = inject(FormBuilder);

  readonly healthStates = ['Saludable', 'En observación', 'Crítico'];
  readonly sexes = ['Macho', 'Hembra', 'Desconocido'];
  readonly recordTypes = ['Revisión', 'Vacunación', 'Tratamiento', 'Alerta IA'];
  readonly sources = ['Veterinario', 'IoT', 'Visión', 'IA'];

  animals = signal<Animal[]>([]);
  species = signal<Species[]>([]);
  stats = signal<AnimalStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtros
  private searchTerm = '';
  private statusFilter = '';
  private debounce?: ReturnType<typeof setTimeout>;

  // Formulario de animal (crear / editar)
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  formError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    tagCode: ['', [Validators.required, Validators.maxLength(40)]],
    speciesId: [0, [Validators.min(1)]],
    sex: ['Desconocido'],
    birthDate: [''],
    weightKg: [0, [Validators.required, Validators.min(0)]],
    enclosure: ['', [Validators.required, Validators.maxLength(80)]],
    healthStatus: ['Saludable'],
    notes: ['', [Validators.maxLength(1000)]]
  });

  // Seguimiento veterinario
  selected = signal<Animal | null>(null);
  records = signal<VetRecord[]>([]);
  recordsLoading = signal(false);
  recordError = signal<string | null>(null);

  recordForm = this.fb.nonNullable.group({
    recordType: ['Revisión'],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    temperatureC: [null as number | null, [Validators.min(20), Validators.max(50)]],
    heartRateBpm: [null as number | null, [Validators.min(1), Validators.max(600)]],
    source: ['Veterinario'],
    anomalyScore: [null as number | null, [Validators.min(0), Validators.max(1)]],
    veterinarian: ['', [Validators.required, Validators.maxLength(80)]]
  });

  ngOnInit(): void {
    this.api.getSpecies().subscribe({
      next: list => this.species.set(list),
      error: err => this.error.set(this.message(err))
    });
    this.reload();
  }

  // ---------- Lectura ----------
  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAnimals(this.searchTerm, this.statusFilter).subscribe({
      next: list => { this.animals.set(list); this.loading.set(false); },
      error: err => { this.error.set(this.message(err)); this.loading.set(false); }
    });
    this.api.getStats().subscribe({ next: s => this.stats.set(s), error: () => undefined });
  }

  onSearch(value: string): void {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => { this.searchTerm = value; this.reload(); }, 300);
  }

  onStatus(value: string): void {
    this.statusFilter = value;
    this.reload();
  }

  // ---------- Crear / editar ----------
  openCreate(): void {
    this.editingId.set(null);
    this.formError.set(null);
    this.form.reset({
      name: '', tagCode: '', speciesId: this.species()[0]?.id ?? 0, sex: 'Desconocido',
      birthDate: '', weightKg: 0, enclosure: '', healthStatus: 'Saludable', notes: ''
    });
    this.showForm.set(true);
  }

  openEdit(a: Animal): void {
    this.editingId.set(a.id);
    this.formError.set(null);
    this.form.reset({
      name: a.name, tagCode: a.tagCode, speciesId: a.speciesId, sex: a.sex,
      birthDate: a.birthDate ?? '', weightKg: a.weightKg, enclosure: a.enclosure,
      healthStatus: a.healthStatus, notes: a.notes ?? ''
    });
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload = { ...v, birthDate: v.birthDate || null, notes: v.notes.trim() || null };
    const id = this.editingId();

    this.saving.set(true);
    this.formError.set(null);
    const request = id === null ? this.api.createAnimal(payload) : this.api.updateAnimal(id, payload);
    request.subscribe({
      next: () => { this.saving.set(false); this.showForm.set(false); this.reload(); },
      error: err => { this.saving.set(false); this.formError.set(this.message(err)); }
    });
  }

  remove(a: Animal): void {
    if (!confirm(`¿Eliminar a ${a.name} y todo su historial de seguimiento? Esta acción no se puede deshacer.`)) return;
    this.api.deleteAnimal(a.id).subscribe({
      next: () => {
        if (this.selected()?.id === a.id) this.selected.set(null);
        this.reload();
      },
      error: err => this.error.set(this.message(err))
    });
  }

  // ---------- Seguimiento ----------
  openRecords(a: Animal): void {
    this.selected.set(a);
    this.recordError.set(null);
    this.recordForm.reset({
      recordType: 'Revisión', description: '', temperatureC: null, heartRateBpm: null,
      source: 'Veterinario', anomalyScore: null, veterinarian: ''
    });
    this.loadRecords(a.id);
  }

  closeRecords(): void {
    this.selected.set(null);
  }

  private loadRecords(animalId: number): void {
    this.recordsLoading.set(true);
    this.api.getRecords(animalId).subscribe({
      next: list => { this.records.set(list); this.recordsLoading.set(false); },
      error: err => { this.recordError.set(this.message(err)); this.recordsLoading.set(false); }
    });
  }

  addRecord(): void {
    const animal = this.selected();
    if (!animal) return;
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }
    this.recordError.set(null);
    this.api.createRecord(animal.id, this.recordForm.getRawValue()).subscribe({
      next: () => {
        this.recordForm.patchValue({ description: '', temperatureC: null, heartRateBpm: null, anomalyScore: null });
        this.recordForm.controls.description.markAsUntouched();
        this.loadRecords(animal.id);
        this.reload(); // el backend puede haber cambiado el estado de salud
      },
      error: err => this.recordError.set(this.message(err))
    });
  }

  validate(r: VetRecord): void {
    this.api.validateRecord(r.id).subscribe({
      next: updated => {
        this.records.update(list => list.map(x => (x.id === updated.id ? updated : x)));
        this.reload();
      },
      error: err => this.recordError.set(this.message(err))
    });
  }

  removeRecord(r: VetRecord): void {
    if (!confirm('¿Eliminar este registro de seguimiento?')) return;
    this.api.deleteRecord(r.id).subscribe({
      next: () => { this.records.update(list => list.filter(x => x.id !== r.id)); this.reload(); },
      error: err => this.recordError.set(this.message(err))
    });
  }

  // ---------- Utilidades de vista ----------
  statusClass(status: string): string {
    switch (status) {
      case 'Saludable': return 'bg-forest-100 text-forest-800';
      case 'En observación': return 'bg-ochre-100 text-ochre-700';
      case 'Crítico': return 'bg-red-100 text-red-700';
      default: return 'bg-earth-100 text-earth-800';
    }
  }

  isAlert(r: VetRecord): boolean {
    return (r.anomalyScore ?? 0) >= 0.6;
  }

  private message(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) return 'No se puede conectar con el servidor. Comprueba que el backend está en marcha.';
      const body = err.error as { message?: string; title?: string; errors?: Record<string, string[]> } | null;
      if (body?.message) return body.message;
      if (body?.errors) return Object.values(body.errors).flat().join(' ');
      if (body?.title) return body.title;
    }
    return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
  }
}
