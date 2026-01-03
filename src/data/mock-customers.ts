export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone: string; // Formato: (11) 98765-4321
  cpf_cnpj?: string;
  type: "individual" | "business";
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string; // Formato: 12345-678
  };
  createdAt: Date;
  totalOrders?: number;
  totalSpent?: number;
}

const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const generateRandomId = () => Math.random().toString(36).substring(2, 15);

const firstNames = [
  "Ana",
  "Bruno",
  "Carla",
  "Daniel",
  "Eduarda",
  "Felipe",
  "Gabriela",
  "Hugo",
  "Isabela",
  "João",
  "Larissa",
  "Marcelo",
  "Natália",
  "Otávio",
  "Paula",
  "Rafael",
  "Sofia",
  "Thiago",
  "Vitória",
  "William",
];
const lastNames = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Pereira",
  "Lima",
  "Costa",
  "Rodrigues",
  "Almeida",
  "Nascimento",
  "Ferreira",
  "Gomes",
  "Martins",
  "Ribeiro",
  "Carvalho",
  "Mendes",
  "Dias",
  "Freitas",
  "Fernandes",
  "Castro",
];
const businessNames = [
  "Tecno Soluções",
  "Comércio Digital",
  "Serviços Inovadores",
  "Consultoria Global",
  "Logística Expressa",
  "Moda Urbana",
  "Alimentos Saudáveis",
  "Construções Modernas",
  "Educação Criativa",
  "Finanças Inteligentes",
];

const cities = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Porto Alegre",
  "Curitiba",
  "Salvador",
  "Fortaleza",
  "Recife",
  "Brasília",
  "Manaus",
];
const states = ["SP", "RJ", "MG", "RS", "PR", "BA", "CE", "PE", "DF", "AM"];
const streetNames = [
  "Rua da Paz",
  "Avenida Brasil",
  "Travessa da Alegria",
  "Alameda dos Anjos",
  "Praça da Liberdade",
  "Rua das Flores",
  "Avenida Central",
  "Travessa da Saudade",
  "Alameda dos Pássaros",
  "Praça da Harmonia",
];

const generatePhone = () =>
  `(${generateRandomNumber(11, 99)}) 9${generateRandomNumber(1000, 9999)}-${generateRandomNumber(1000, 9999)}`;
const generateCpfCnpj = (type: "individual" | "business") => {
  if (type === "individual") {
    return `${generateRandomNumber(100, 999)}.${generateRandomNumber(100, 999)}.${generateRandomNumber(100, 999)}-${generateRandomNumber(10, 99)}`;
  } else {
    return `${generateRandomNumber(10, 99)}.${generateRandomNumber(100, 999)}.${generateRandomNumber(100, 999)}/${generateRandomNumber(1000, 9999)}-${generateRandomNumber(10, 99)}`;
  }
};

const generateAddress = () => ({
  street: `${streetNames[generateRandomNumber(0, streetNames.length - 1)]}`,
  number: `${generateRandomNumber(1, 2000)}`,
  complement:
    generateRandomNumber(0, 1) === 1
      ? `Apto ${generateRandomNumber(1, 500)}`
      : undefined,
  neighborhood: `Bairro ${generateRandomNumber(1, 50)}`,
  city: cities[generateRandomNumber(0, cities.length - 1)],
  state: states[generateRandomNumber(0, states.length - 1)],
  zipCode: `${generateRandomNumber(10000, 99999)}-${generateRandomNumber(100, 999)}`,
});

export const mockCustomers: Customer[] = Array.from({ length: 50 }).map(
  (_, index) => {
    const type: "individual" | "business" =
      index % 3 === 0 ? "business" : "individual"; // Roughly 1/3 business
    const name =
      type === "individual"
        ? `${firstNames[generateRandomNumber(0, firstNames.length - 1)]} ${lastNames[generateRandomNumber(0, lastNames.length - 1)]}`
        : `${businessNames[generateRandomNumber(0, businessNames.length - 1)]} LTDA`;

    const cleanName = name
      .toLowerCase()
      .replace(/\s/g, ".")
      .replace(/[^a-z.]/g, "");

    return {
      id: generateRandomId(),
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&rounded=true&bold=true`,
      email: `${cleanName}@example.com`,
      phone: generatePhone(),
      cpf_cnpj: generateCpfCnpj(type),
      type,
      address: generateAddress(),
      createdAt: new Date(
        Date.now() - generateRandomNumber(0, 365 * 24 * 60 * 60 * 1000),
      ), // Up to 1 year old
      totalOrders: generateRandomNumber(0, 50),
      totalSpent: parseFloat((Math.random() * 5000).toFixed(2)),
    };
  },
);
