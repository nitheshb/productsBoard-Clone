import { ProductDropdown } from "./ProductDropdown";

export default function ProductDropdownPage() {
  const handleProductSelect = (productIds: string[]) => {
    console.log("Selected product IDs:", productIds);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Product</h1>
      <ProductDropdown onProductSelect={handleProductSelect} />
    </div>
  );
}
