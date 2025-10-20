import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../_service/product.service';
import { Product } from '../_model/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  // Modal de confirmación
  showConfirm = false;
  toDelete?: Product;

  constructor(
    private productService: ProductService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.list().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Error al cargar productos:', err);
        alert('Error al cargar los productos. Por favor, intente nuevamente.');
      }
    });
  }

  edit(p: Product): void {
    this.router.navigate(['/product', p.idProduct]);
  }

  confirmDelete(p: Product): void {
    this.toDelete = p;
    this.showConfirm = true;
  }

  cancelDelete(): void {
    this.showConfirm = false;
    this.toDelete = undefined;
  }

  deleteConfirmed(): void {
    if (!this.toDelete?.idProduct) { this.cancelDelete(); return; }
    this.productService.delete(this.toDelete.idProduct!).subscribe({
      next: () => {
        this.cancelDelete();
        this.load();
      },
      error: (err: any) => {
        console.error('Error al eliminar producto:', err);
        alert('Error al eliminar el producto. Por favor, intente nuevamente.');
      }
    });
  }
}
