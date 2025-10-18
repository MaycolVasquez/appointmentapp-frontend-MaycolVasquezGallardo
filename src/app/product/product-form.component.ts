import {{ Component, OnInit }} from '@angular/core';
import {{ ProductService }} from '../_service/product.service';
import {{ Product }} from '../_model/product';

@Component({{
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
}})
export class ProductFormComponent implements OnInit {{
  product: Product = {{ name:'', description:'', presentation:'', stock:0, unitPrice:0, expired:false }};

  constructor(private productService: ProductService){{}}

  ngOnInit(): void{{}}

  save(){{ this.productService.save(this.product).subscribe(()=>alert('Guardado')); }}
}}
