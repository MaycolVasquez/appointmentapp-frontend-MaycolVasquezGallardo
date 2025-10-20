import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../_model/category';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = `${environment.apiUrl}/${environment.endpoints?.categories ?? 'categories'}`;
  constructor(private http: HttpClient) {}
  list(): Observable<Category[]> { return this.http.get<Category[]>(this.api); }
}
