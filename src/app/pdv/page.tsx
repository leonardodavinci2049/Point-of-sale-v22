import { Suspense } from "react";
import { ProductService } from "@/lib/services/product-service";
import { CustomerService } from "@/lib/services/customer-service";
import { PDVContainer } from "./components/client/pdv-container";
import { PDVSkeleton } from "./components/server/pdv-skeleton";

async function PDVData() {
  // Load data on server
  const [products, customers] = await Promise.all([
    ProductService.getAll(),
    CustomerService.getAll(),
  ]);

  return (
    <PDVContainer initialProducts={products} initialCustomers={customers} />
  );
}

export default function PDVPage() {
  return (
    <Suspense fallback={<PDVSkeleton />}>
      <PDVData />
    </Suspense>
  );
}