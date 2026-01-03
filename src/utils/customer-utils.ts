import type { Customer } from "@/data/mock-customers";

/**
 * Opções de APIs para gerar avatars
 */
const AVATAR_APIS = {
  // DiceBear - Avataaars style (similar ao Gravatar)
  dicebear_avataaars: (name: string) =>
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,

  // DiceBear - Adventurer style
  dicebear_adventurer: (name: string) =>
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,

  // UI Avatars - Iniciais com fundo colorido
  ui_avatars: (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&rounded=true&bold=true`,

  // RoboHash - Robots únicos
  robohash: (name: string) =>
    `https://robohash.org/${encodeURIComponent(name)}.png?set=set1&size=128x128`,

  // DiceBear - Big Ears (mais neutro)
  dicebear_bigears: (name: string) =>
    `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
};

/**
 * Gera uma URL de avatar baseada no nome do cliente
 */
function generateAvatarUrl(
  name: string,
  style: keyof typeof AVATAR_APIS = "dicebear_avataaars",
): string {
  const cleanName = name
    .toLowerCase()
    .replace(/\s/g, ".")
    .replace(/[^a-z.]/g, "")
    .trim();

  // Se o nome limpo estiver vazio, usa um fallback
  const seed = cleanName || "default-user";

  return AVATAR_APIS[style](seed);
}

/**
 * Garante que um cliente tenha um avatar válido
 * Gera um avatar baseado no nome se não estiver presente
 */
export function ensureCustomerHasAvatar(customer: Customer): Customer {
  // Se o cliente já tem avatar e não está vazio, retorna como está
  if (customer.avatar && customer.avatar.trim() !== "") {
    return customer;
  }

  // Gera um avatar baseado no nome usando UI Avatars (mais confiável)
  return {
    ...customer,
    avatar: generateAvatarUrl(customer.name, "ui_avatars"),
  };
}

/**
 * Gera um avatar para um novo cliente
 */
export function generateCustomerAvatar(
  name: string,
  style: keyof typeof AVATAR_APIS = "ui_avatars",
): string {
  return generateAvatarUrl(name, style);
}

/**
 * Garante que uma lista de clientes tenha avatars válidos
 */
export function ensureCustomersHaveAvatars(customers: Customer[]): Customer[] {
  return customers.map(ensureCustomerHasAvatar);
}
