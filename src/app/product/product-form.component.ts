import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  product: Product = { 
    name: '', 
    expired: false 
  } as Product;
  isEditMode = false;
  productId?: number;

  categories: Category[] = [];
  families: Family[] = [];
  laboratories: Laboratory[] = [];

  selectedCategoryId: number | null = null;
  selectedFamilyId: number | null = null;
  selectedLaboratoryId: number | null = null;

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
        next: (data) => {
          console.log('Categorías cargadas:', data);
          this.categories = data || [];
        },
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
        next: (data) => {
          console.log('Familias cargadas:', data);
          this.families = data || [];
        },
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
        next: (data) => {
          console.log('Laboratorios cargados:', data);
          this.laboratories = data || [];
        },
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
        // Preseleccionar IDs en modo edición si existen (con tolerancia a distintos nombres de campos)
        this.selectedCategoryId = (data as any)?.category?.idCategory ?? (data as any)?.category?.idCategoria ?? null;
        this.selectedFamilyId = (data as any)?.family?.idFamily ?? (data as any)?.family?.idFamilia ?? null;
        this.selectedLaboratoryId = (data as any)?.laboratory?.idLaboratory ?? (data as any)?.laboratory?.idLaboratorio ?? null;
      },
      error: (err: any) => {
        console.error('Error al cargar producto:', err);
        alert('Error al cargar el producto');
        this.router.navigate(['/product']);
      }
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      // Evitar enviar si el formulario es inválido
      form.control.markAllAsTouched();
      return;
    }
    // Preparar payload limpio - solo enviar campos que tienen valor
    const payload: any = {
      name: this.product.name,
      expired: this.product.expired || false
    };

    // Agregar relaciones como objetos anidados (patrón común en Spring/JPA)
    if (this.selectedCategoryId != null) {
      payload.category = { idCategory: Number(this.selectedCategoryId) };
    }
    if (this.selectedFamilyId != null) {
      payload.family = { idFamily: Number(this.selectedFamilyId) };
    }
    if (this.selectedLaboratoryId != null) {
      payload.laboratory = { idLaboratory: Number(this.selectedLaboratoryId) };
    }

    // Solo agregar campos opcionales si tienen valor válido (no vacíos ni 0)
    if (this.product.description && this.product.description.trim()) {
      payload.description = this.product.description;
    }
    if (this.product.presentation && this.product.presentation.trim()) {
      payload.presentation = this.product.presentation;
    }
    if (this.product.stock && this.product.stock > 0) {
      payload.stock = this.product.stock;
    }
    if (this.product.unitPrice && this.product.unitPrice > 0) {
      payload.unitPrice = this.product.unitPrice;
    }

  console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

    if (this.isEditMode && this.productId) {
      payload.idProduct = this.productId;
      this.productService.update(payload).subscribe({
        next: (response) => {
          console.log('Producto actualizado:', response);
          alert('Producto actualizado exitosamente');
          setTimeout(() => this.router.navigate(['/product']), 100);
        },
        error: (err: any) => {
          console.error('Error completo:', err);
          console.error('Error response:', err.error);
          const msg = err?.error?.message || err?.error?.error || err?.message || 'Error desconocido';
          alert(`Error al actualizar: ${msg}`);
        }
      });
    } else {
      this.productService.save(payload).subscribe({
        next: (response) => {
          console.log('Producto guardado:', response);
          alert('Producto guardado exitosamente');
          setTimeout(() => this.router.navigate(['/product']), 100);
        },
        error: (err: any) => {
          console.error('Error completo:', err);
          console.error('Error response:', err.error);
          const msg = err?.error?.message || err?.error?.error || err?.message || 'Error desconocido';
          alert(`Error al guardar: ${msg}`);
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