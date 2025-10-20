import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../_model/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = `${environment.apiUrl}/${environment.endpoints?.products ?? 'products'}`;

  constructor(private http: HttpClient) { }

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  save(p: Product): Observable<any> {
    return this.http.post(this.api, p);
  }

  update(p: Product): Observable<any> {
    return this.http.put(`${this.api}/${p.idProduct}`, p);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
