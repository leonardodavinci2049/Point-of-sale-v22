"use client";

import type React from "react";
import { useState } from "react";
import CustomerAvatar from "@/app/pdv/components/client/customer-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/types/customer";
import { fuzzySearch } from "@/utils/search";

interface SearchCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  customers: Customer[];
}

const SearchCustomerModal: React.FC<SearchCustomerModalProps> = ({
  isOpen,
  onClose,
  onSelectCustomer,
  customers,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>(customers);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const results = fuzzySearch(customers, term, [
      "name",
      "phone",
      "cpf_cnpj",
    ]);
    setSearchResults(results);
  };

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
    onClose();
    setSearchTerm("");
    setSearchResults(customers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Digite o nome, telefone ou CPF/CNPJ do cliente..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="space-y-2">
            {searchResults.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                Nenhum cliente encontrado.
              </p>
            ) : (
              searchResults.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="w-full text-left cursor-pointer rounded-lg border p-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => handleSelect(customer)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(customer);
                    }
                  }}
                  aria-label={`Selecionar cliente ${customer.name}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-4">
                      <CustomerAvatar
                        src={customer.avatar}
                        alt={`Avatar de ${customer.name}`}
                        customerName={customer.name}
                        size={48}
                        className="h-12 w-12"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {customer.phone}
                        </p>
                        {customer.cpf_cnpj && (
                          <p className="text-muted-foreground text-sm">
                            {customer.cpf_cnpj}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          {customer.type === "individual"
                            ? "Pessoa Física"
                            : "Pessoa Jurídica"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                      asChild
                    >
                      <span>Selecionar</span>
                    </Button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchCustomerModal;
