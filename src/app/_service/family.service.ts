import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Family } from '../_model/family';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  private api = `${environment.apiUrl}/${environment.endpoints?.families ?? 'families'}`;
  constructor(private http: HttpClient) {}
  list(): Observable<Family[]> { return this.http.get<Family[]>(this.api); }
}
