import {{ Component, OnInit }} from '@angular/core';
import {{ ProductService }} from '../_service/product.service';
import {{ Product }} from '../_model/product';

@Component({{
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
}})
export class ProductListComponent implements OnInit {{
  products: Product[] = [];

  constructor(private productService: ProductService){{}}

  ngOnInit(): void{{ this.load(); }}

  load(){{ this.productService.list().subscribe(data => this.products = data); }}

  edit(p: Product){{ /* navigate to edit - omitted */ }}

  confirmDelete(p: Product){{ if(confirm(`¿Eliminar ${p.name}?`)) this.productService.delete(p.idProduct!).subscribe(()=>this.load()); }}
}}
