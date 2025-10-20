import { Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list.component';
import { ProductFormComponent } from './product/product-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/product', pathMatch: 'full' },
  { path: 'product', component: ProductListComponent },
  { path: 'product/new', component: ProductFormComponent },
  { path: 'product/:id', component: ProductFormComponent }
];
