"use client";

import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/items-management/DataTable';
import Pagination from "../components/pagination";

interface Item {
  id: number;
  cm_part_id: string;
  cm_part_description: string;
  unit: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  supplier_sku: string;
}

export default function ItemsPage() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(`/api/items-management?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        setData(result.data);
        setTotalCount(result.total[0].count);
      } catch (error: any) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Ensure loading state is turned off
      }
    };

    fetchItems();
  }, [currentPage, itemsPerPage]); // Include itemsPerPage in dependencies

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <h1 className="text-2xl font-semibold mb-4">Items Management</h1>
          <DataTable data={data} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </>
  );
}
