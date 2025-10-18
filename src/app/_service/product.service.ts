import {{ HttpClient }} from '@angular/common/http';
import {{ Injectable }} from '@angular/core';
import {{ Observable }} from 'rxjs';
import {{ Product }} from '../_model/product';

@Injectable({{
  providedIn: 'root'
}})
export class ProductService {{
  private api = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {{ }}

  list(): Observable<Product[]>{{ return this.http.get<Product[]>(this.api); }}
  getById(id:number){{ return this.http.get<Product>(`${{this.api}}/${{id}}`); }}
  save(p:Product){{ return this.http.post(this.api, p); }}
  update(p:Product){{ return this.http.put(`${{this.api}}/${{p.idProduct}}`, p); }}
  delete(id:number){{ return this.http.delete(`${{this.api}}/${{id}}`); }}
}}
