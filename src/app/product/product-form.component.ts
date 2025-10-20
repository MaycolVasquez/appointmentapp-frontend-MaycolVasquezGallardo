import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_service/product.service';
import { Category } from '../_model/category';
import { Family } from '../_model/family';
import { Laboratory } from '../_model/laboratory';
import { CategoryService } from '../_service/category.service';
import { FamilyService } from '../_service/family.service';
import { LaboratoryService } from '../_service/laboratory.service';
import { Product } from '../_model/product';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  product: Product = { name: '', expired: false } as Product;
  isEditMode = false;
  productId?: number;

  categories: Category[] = [];
  families: Family[] = [];
  laboratories: Laboratory[] = [];

  // Flags de carga y error para catálogos
  loadingCategories = false;
  loadingFamilies = false;
  loadingLaboratories = false;

  categoriesError: string | null = null;
  familiesError: string | null = null;
  laboratoriesError: string | null = null;

  apiBase = environment.apiUrl;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private familyService: FamilyService,
    private laboratoryService: LaboratoryService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    // Cargar catálogos
    this.loadCatalogs();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadCatalogs(): void {
    // Categorías
    this.loadingCategories = true;
    this.categoriesError = null;
    this.categoryService.list()
      .pipe(finalize(() => (this.loadingCategories = false)))
      .subscribe({
        next: (data) => (this.categories = data || []),
        error: (err) => {
          console.error('Error cargando categorías:', err);
          this.categoriesError = `No se pudieron cargar categorías desde ${this.apiBase}/categories`;
        }
      });

    // Familias
    this.loadingFamilies = true;
    this.familiesError = null;
    this.familyService.list()
      .pipe(finalize(() => (this.loadingFamilies = false)))
      .subscribe({
        next: (data) => (this.families = data || []),
        error: (err) => {
          console.error('Error cargando familias:', err);
          this.familiesError = `No se pudieron cargar familias desde ${this.apiBase}/families`;
        }
      });

    // Laboratorios
    this.loadingLaboratories = true;
    this.laboratoriesError = null;
    this.laboratoryService.list()
      .pipe(finalize(() => (this.loadingLaboratories = false)))
      .subscribe({
        next: (data) => (this.laboratories = data || []),
        error: (err) => {
          console.error('Error cargando laboratorios:', err);
          this.laboratoriesError = `No se pudieron cargar laboratorios desde ${this.apiBase}/laboratories`;
        }
      });
  }

  loadProduct(id: number): void {
    this.productService.getById(id).subscribe({
      next: (data: Product) => {
        this.product = data;
      },
      error: (err: any) => {
        console.error('Error al cargar producto:', err);
        alert('Error al cargar el producto');
        this.router.navigate(['/product']);
      }
    });
  }

  save(): void {
    // Preparar payload enviando solo IDs de catálogos si existen
    const payload: any = {
      idProduct: this.isEditMode ? this.productId : undefined,
      name: this.product.name,
      expired: this.product.expired,
      category: this.product.category ? { idCategory: this.product.category.idCategory } : null,
      family: this.product.family ? { idFamily: this.product.family.idFamily } : null,
      laboratory: this.product.laboratory ? { idLaboratory: this.product.laboratory.idLaboratory } : null
    };

    if (this.isEditMode && this.productId) {
      payload.idProduct = this.productId;
      this.productService.update(payload).subscribe({
        next: () => {
          alert('Producto actualizado exitosamente');
          this.router.navigate(['/product']);
        },
        error: (err: any) => {
          console.error('Error:', err);
          alert('Error al actualizar el producto');
        }
      });
    } else {
      this.productService.save(payload).subscribe({
        next: () => {
          alert('Producto guardado exitosamente');
          this.router.navigate(['/product']);
        },
        error: (err: any) => {
          console.error('Error:', err);
          alert('Error al guardar el producto');
        }
      });
    }
  }

  // Comparadores para selects
  compareCategory = (a: Category | null, b: Category | null) => a && b ? a.idCategory === b.idCategory : a === b;
  compareFamily = (a: Family | null, b: Family | null) => a && b ? a.idFamily === b.idFamily : a === b;
  compareLaboratory = (a: Laboratory | null, b: Laboratory | null) => a && b ? a.idLaboratory === b.idLaboratory : a === b;

  cancel(): void {
    this.router.navigate(['/product']);
  }
}
