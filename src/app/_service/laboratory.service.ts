import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratory } from '../_model/laboratory';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LaboratoryService {
  private api = `${environment.apiUrl}/${environment.endpoints?.laboratories ?? 'laboratories'}`;
  constructor(private http: HttpClient) {}
  list(): Observable<Laboratory[]> { return this.http.get<Laboratory[]>(this.api); }
}
