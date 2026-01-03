import { Search, UserPlus } from "lucide-react";
import type React from "react";
import CustomerAvatar from "@/app/pdv/components/client/customer-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/data/mock-customers";

interface CustomerPanelProps {
  customer: Customer | null;
  onSearchCustomer: () => void;
  onAddCustomer: () => void;
}

const CustomerPanel: React.FC<CustomerPanelProps> = ({
  customer,
  onSearchCustomer,
  onAddCustomer,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start justify-between gap-2 space-y-0 pb-2 sm:flex-row sm:items-center sm:gap-0">
        <CardTitle className="text-sm font-medium">Cliente</CardTitle>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={onSearchCustomer}
            className="flex-1 sm:flex-none"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onAddCustomer}
            className="flex-1 sm:flex-none"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {customer ? (
          <div className="flex items-center gap-4">
            <CustomerAvatar
              src={customer.avatar}
              alt={`Avatar de ${customer.name}`}
              customerName={customer.name}
              size={64}
              className="h-12 w-12 flex-shrink-0 sm:h-16 sm:w-16"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-bold sm:text-xl">
                {customer.name}
              </div>
              <div className="text-muted-foreground truncate text-sm">
                {customer.phone}
              </div>
              {customer.cpf_cnpj && (
                <div className="text-muted-foreground truncate text-sm">
                  {customer.cpf_cnpj}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-md text-muted-foreground">
            Nenhum cliente selecionado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPanel;
