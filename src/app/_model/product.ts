export interface Product {
  idProduct?: number;
  name: string;
  description: string;
  presentation: string;
  stock: number;
  unitPrice: number;
  expired: boolean;
  category?: any;
  family?: any;
  laboratory?: any;
}
