export interface Product {
  idProduct?: number;
  name: string;
  description?: string;
  presentation?: string;
  stock?: number;
  unitPrice?: number;
  expired: boolean;
  category?: import('./category').Category | null;
  family?: import('./family').Family | null;
  laboratory?: import('./laboratory').Laboratory | null;
}
