export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "clothing" | "shoes" | "accessories" | "electronics";
  price: number;
  image: string;
  stock: number;
  variants?: {
    size?: string[];
    color?: string[];
  };
}
