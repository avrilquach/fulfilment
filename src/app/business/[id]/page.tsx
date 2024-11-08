"use client";

import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import Sidebar from "../../components/business/Sidebar";
import Pagination from "../../components/pagination";
import Link from "next/link";
import {useParams} from "next/navigation";
import DataTable from "../../components/business/DataTable";

interface Item {
  id: number;
  stock: number;
  min_stock: number;
  supplier_sku: string;
  location: string;
  shelve: string;
  bin_names: string;
  cm_part_id: number;
  tat_sku: number;
  product_link: string;
  cm_part_description: string;
  qty: number;
  max_stock: number;
  unit: string;
  progress?: number;  // Optional progress
  fullfilment_triggered?: string; // Optional column for fulfillment status
  full_count: number;  // Full count
  empty_count: number; // Empty count
}

export default function ItemsPage() {
  const { id } = useParams();
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
        const response = await fetch(`/api/business/get?id=${id}&page=${currentPage}&limit=${itemsPerPage}`);
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
  }, [currentPage, itemsPerPage,id]); // Include itemsPerPage in dependencies

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  console.log(data);
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <h1 className="text-2xl font-semibold mb-4">Items Management</h1>
          <DataTable data={data} /> {/* Truyền dữ liệu vào DataTable */}
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
