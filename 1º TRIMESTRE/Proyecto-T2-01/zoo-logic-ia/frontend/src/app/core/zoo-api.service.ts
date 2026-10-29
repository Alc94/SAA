import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Animal, AnimalStats, AnimalWrite, ChatResponse, Species, VetRecord, VetRecordWrite
} from './models';

/** Cliente HTTP de la API ASP.NET. En Docker, nginx redirige /api al backend. */
@Injectable({ providedIn: 'root' })
export class ZooApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  // Especies
  getSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.base}/species`);
  }

  // Animales (CRUD)
  getAnimals(search = '', status = ''): Observable<Animal[]> {
    let params = new HttpParams();
    if (search.trim()) params = params.set('search', search.trim());
    if (status) params = params.set('status', status);
    return this.http.get<Animal[]>(`${this.base}/animals`, { params });
  }

  getStats(): Observable<AnimalStats> {
    return this.http.get<AnimalStats>(`${this.base}/animals/stats`);
  }

  createAnimal(data: AnimalWrite): Observable<Animal> {
    return this.http.post<Animal>(`${this.base}/animals`, data);
  }

  updateAnimal(id: number, data: AnimalWrite): Observable<Animal> {
    return this.http.put<Animal>(`${this.base}/animals/${id}`, data);
  }

  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/animals/${id}`);
  }

  // Registros de seguimiento
  getRecords(animalId: number): Observable<VetRecord[]> {
    return this.http.get<VetRecord[]>(`${this.base}/animals/${animalId}/records`);
  }

  createRecord(animalId: number, data: VetRecordWrite): Observable<VetRecord> {
    return this.http.post<VetRecord>(`${this.base}/animals/${animalId}/records`, data);
  }

  validateRecord(id: number): Observable<VetRecord> {
    return this.http.put<VetRecord>(`${this.base}/records/${id}/validate`, {});
  }

  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/records/${id}`);
  }

  // Chatbot educativo
  ask(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.base}/chatbot/ask`, { question });
  }
}
