export interface Product {
  id: string;
  code: string; // Ex: "PROD-001"
  name: string;
  description: string;
  category: "clothing" | "shoes" | "accessories" | "electronics";
  price: number;
  image: string; // URL da imagem
  stock: number;
  variants?: {
    size?: string[]; // Ex: ['P', 'M', 'G', 'GG']
    color?: string[]; // Ex: ['Preto', 'Branco', 'Azul']
  };
}

const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomId = () => Math.random().toString(36).substring(2, 15);

const _categories = ["clothing", "shoes", "accessories", "electronics"];
const clothingNames = [
  "Camiseta Básica",
  "Calça Jeans Slim",
  "Vestido Floral",
  "Jaqueta Corta-Vento",
  "Blusa de Moletom",
];
const shoeNames = [
  "Tênis Esportivo",
  "Sandália de Couro",
  "Bota Casual",
  "Sapato Social",
  "Chinelo Slide",
];
const accessoryNames = [
  "Boné Aba Curva",
  "Bolsa Transversal",
  "Cinto de Couro",
  "Óculos de Sol",
  "Relógio Digital",
];
const electronicNames = [
  "Fone de Ouvido Bluetooth",
  "Carregador Portátil",
  "Cabo USB-C",
  "Smartwatch",
  "Caixa de Som Portátil",
];

const sizes = ["P", "M", "G", "GG"];
const colors = ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Amarelo"];

const generateProduct = (
  category: Product["category"],
  name: string,
  description: string,
  price: number,
  hasVariants: boolean = false,
): Product => ({
  id: generateRandomId(),
  code: `PROD-${generateRandomNumber(100, 999)}`,
  name,
  description,
  category,
  price: parseFloat(price.toFixed(2)),
  image: `https://picsum.photos/seed/${generateRandomId()}/200/200`,
  stock: generateRandomNumber(10, 200),
  ...(hasVariants && { variants: { size: sizes, color: colors } }),
});

export const mockProducts: Product[] = [
  // Clothing (15 products)
  ...Array.from({ length: 3 }).flatMap(() => [
    generateProduct(
      "clothing",
      clothingNames[0],
      "Camiseta de algodão 100% para o dia a dia.",
      49.9,
      true,
    ),
    generateProduct(
      "clothing",
      clothingNames[1],
      "Calça jeans com corte slim e lavagem moderna.",
      129.9,
      true,
    ),
    generateProduct(
      "clothing",
      clothingNames[2],
      "Vestido leve e confortável com estampa floral.",
      89.9,
      true,
    ),
    generateProduct(
      "clothing",
      clothingNames[3],
      "Jaqueta ideal para dias de vento e chuva leve.",
      189.9,
      true,
    ),
    generateProduct(
      "clothing",
      clothingNames[4],
      "Blusa de moletom flanelada, perfeita para o inverno.",
      99.9,
      true,
    ),
  ]),
  // Shoes (15 products)
  ...Array.from({ length: 3 }).flatMap(() => [
    generateProduct(
      "shoes",
      shoeNames[0],
      "Tênis confortável para caminhada e corrida.",
      199.9,
      true,
    ),
    generateProduct(
      "shoes",
      shoeNames[1],
      "Sandália elegante para eventos casuais.",
      79.9,
      true,
    ),
    generateProduct(
      "shoes",
      shoeNames[2],
      "Bota de couro sintético, resistente e estilosa.",
      249.9,
      true,
    ),
    generateProduct(
      "shoes",
      shoeNames[3],
      "Sapato social clássico para ocasiões formais.",
      159.9,
      true,
    ),
    generateProduct(
      "shoes",
      shoeNames[4],
      "Chinelo macio e leve para o verão.",
      39.9,
      false,
    ),
  ]),
  // Accessories (10 products)
  ...Array.from({ length: 2 }).flatMap(() => [
    generateProduct(
      "accessories",
      accessoryNames[0],
      "Boné com ajuste traseiro e logo bordado.",
      35.0,
      false,
    ),
    generateProduct(
      "accessories",
      accessoryNames[1],
      "Bolsa pequena com alça ajustável.",
      110.0,
      false,
    ),
    generateProduct(
      "accessories",
      accessoryNames[2],
      "Cinto de couro legítimo com fivela metálica.",
      65.0,
      false,
    ),
    generateProduct(
      "accessories",
      accessoryNames[3],
      "Óculos de sol com proteção UV400.",
      95.0,
      false,
    ),
    generateProduct(
      "accessories",
      accessoryNames[4],
      "Relógio digital com diversas funções.",
      130.0,
      false,
    ),
  ]),
  // Electronics (10 products)
  ...Array.from({ length: 2 }).flatMap(() => [
    generateProduct(
      "electronics",
      electronicNames[0],
      "Fone de ouvido com cancelamento de ruído.",
      299.0,
      false,
    ),
    generateProduct(
      "electronics",
      electronicNames[1],
      "Carregador rápido para smartphones.",
      70.0,
      false,
    ),
    generateProduct(
      "electronics",
      electronicNames[2],
      "Cabo USB-C de alta durabilidade.",
      25.0,
      false,
    ),
    generateProduct(
      "electronics",
      electronicNames[3],
      "Smartwatch com monitor de atividades físicas.",
      350.0,
      false,
    ),
    generateProduct(
      "electronics",
      electronicNames[4],
      "Caixa de som portátil com bateria de longa duração.",
      180.0,
      false,
    ),
  ]),
];
