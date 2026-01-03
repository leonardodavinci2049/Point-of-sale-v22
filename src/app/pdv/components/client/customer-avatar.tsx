import { User } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { generateCustomerAvatar } from "@/utils/customer-utils";

interface CustomerAvatarProps {
  src?: string;
  alt: string;
  customerName?: string;
  size?: number;
  className?: string;
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
  src,
  alt,
  customerName,
  size = 48,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  // Se não há src ou é uma string vazia, mostra um ícone padrão
  if (!src || src.trim() === "" || imageError) {
    // Se temos o nome do cliente e ainda não tentamos o fallback, tenta gerar um avatar
    if (customerName && !fallbackSrc && !imageError) {
      const generated = generateCustomerAvatar(customerName);
      setFallbackSrc(generated);
      return (
        <Image
          src={generated}
          alt={alt}
          width={size}
          height={size}
          className={`flex-shrink-0 rounded-full ${className}`}
          onError={() => setImageError(true)}
        />
      );
    }

    // Fallback final: ícone de usuário
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 ${className}`}
        style={{ width: size, height: size }}
      >
        <User className="h-1/2 w-1/2 text-neutral-500 dark:text-neutral-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`flex-shrink-0 rounded-full ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default CustomerAvatar;
