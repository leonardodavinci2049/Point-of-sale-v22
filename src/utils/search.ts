export function fuzzySearch<T>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[],
): T[] {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    return items; // Retorna todos os itens se o termo de busca estiver vazio
  }

  return items.filter((item) =>
    keys.some((key) => {
      const value = String(item[key]).toLowerCase();
      return value.includes(term);
    }),
  );
}
