"use client"; // Specify that this is a client component
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";

const AddItemPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cm_part_id: "",
    cm_part_description: "",
    unit: "",
    stock: 0,
    min_stock: 0,
    max_stock: 0,
    supplier_sku: "",
    product_link: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle changes for both input and textarea
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/items-management/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      // Redirect to items management page after successful addition
      router.push("/items-management");
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <h1 className="text-2xl font-semibold">Add New Item</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="cm_part_id">
                Part ID
              </label>
              <input
                type="text"
                id="cm_part_id"
                name="cm_part_id"
                value={formData.cm_part_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="cm_part_description">
                Part Description
              </label>
              <textarea
                id="cm_part_description"
                name="cm_part_description"
                value={formData.cm_part_description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="unit">
                Unit
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="stock">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="min_stock">
                Minimum Stock
              </label>
              <input
                type="number"
                id="min_stock"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="max_stock">
                Maximum Stock
              </label>
              <input
                type="number"
                id="max_stock"
                name="max_stock"
                value={formData.max_stock}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="supplier_sku">
                Supplier SKU
              </label>
              <input
                type="text"
                id="supplier_sku"
                name="supplier_sku"
                value={formData.supplier_sku}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" htmlFor="product_link">
                Product Link
              </label>
              <input
                type="url"
                id="product_link"
                name="product_link"
                value={formData.product_link}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AddItemPage;
