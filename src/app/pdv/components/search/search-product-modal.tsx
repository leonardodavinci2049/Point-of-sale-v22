"use client";

import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/product";
import { fuzzySearch } from "@/utils/search";

interface SearchProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

const SearchProductModal: React.FC<SearchProductModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>(products);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const results = fuzzySearch(products, term, [
      "name",
      "code",
      "description",
      "category",
    ]);
    setSearchResults(results);
  };

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
    setSearchTerm("");
    setSearchResults(products);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Digite o nome, código ou categoria do produto..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum produto encontrado.
              </p>
            ) : (
              searchResults.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="w-full text-left p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-start space-x-4 transition-colors"
                  onClick={() => handleSelect(product)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(product);
                    }
                  }}
                  aria-label={`Selecionar produto ${product.name}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.code}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      R$ {product.price.toFixed(2)}
                    </p>
                    {product.variants && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Variações: {product.variants.size?.join(", ")} |{" "}
                        {product.variants.color?.join(", ")}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                    asChild
                  >
                    <span>Adicionar</span>
                  </Button>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchProductModal;
