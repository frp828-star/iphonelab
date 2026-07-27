export interface Product {
  id: number;
  slug: string;

  name: string;
  category: string;
  description: string;

  price: number;

  image: string;
  images?: string[];

  featured: boolean;
  sale: boolean;

  stock?: number;
}