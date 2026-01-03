"use client";

import type React from "react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/data/mock-customers";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const streetId = useId();
  const numberId = useId();
  const complementId = useId();
  const neighborhoodId = useId();
  const cityId = useId();
  const stateId = useId();
  const zipCodeId = useId();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast.error("Nome e telefone são obrigatórios.");
      return;
    }

    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 15),
      name: formData.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff&size=128&rounded=true&bold=true`,
      phone: formData.phone,
      email: formData.email || undefined,
      type: "individual",
      address: formData.address.street ? formData.address : undefined,
      createdAt: new Date(),
    };

    onAddCustomer(newCustomer);
    toast.success(`Cliente ${newCustomer.name} adicionado com sucesso!`);
    onClose();
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor={nameId}>Nome *</Label>
            <Input
              id={nameId}
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={phoneId}>Telefone *</Label>
            <Input
              id={phoneId}
              placeholder="(11) 98765-4321"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={emailId}>Email</Label>
            <Input
              id={emailId}
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Endereço (Opcional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={streetId}>Rua</Label>
                <Input
                  id={streetId}
                  placeholder="Rua da Paz"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleChange("address.street", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={numberId}>Número</Label>
                <Input
                  id={numberId}
                  placeholder="123"
                  value={formData.address.number}
                  onChange={(e) =>
                    handleChange("address.number", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={complementId}>Complemento</Label>
                <Input
                  id={complementId}
                  placeholder="Apto 45"
                  value={formData.address.complement}
                  onChange={(e) =>
                    handleChange("address.complement", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={neighborhoodId}>Bairro</Label>
                <Input
                  id={neighborhoodId}
                  placeholder="Centro"
                  value={formData.address.neighborhood}
                  onChange={(e) =>
                    handleChange("address.neighborhood", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={cityId}>Cidade</Label>
                <Input
                  id={cityId}
                  placeholder="São Paulo"
                  value={formData.address.city}
                  onChange={(e) => handleChange("address.city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={stateId}>Estado</Label>
                <Input
                  id={stateId}
                  placeholder="SP"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleChange("address.state", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={zipCodeId}>CEP</Label>
                <Input
                  id={zipCodeId}
                  placeholder="12345-678"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    handleChange("address.zipCode", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Adicionar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
