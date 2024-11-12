"use client";
import React, { useEffect, useState } from 'react';
import Header from '../../../components/header';
import Sidebar from "../../../components/business/Sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import RackID from "../../../components/business/shelve/RackID";
import Breadcrumb from "../../../components/business/Breadcrumb"; // Import the new RackID component

interface Item {
  location_name: string;
  shelve_id: number;
  bin_name: string;
  container_rfid: string;
  cm_part_id: string;
  cm_part_description: string;
  qty_per_container: number;
  unit: string;
  status: string;
  fill_date: string;
  bu: string;
  location_id: string;
}

export default function ItemsPage() {
  const { id } = useParams();

  // Ensure id is a string and handle cases where it's an array
  const rackId = Array.isArray(id) ? id[0] : id;  // Extract the first value if id is an array

  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(`/api/business/shelve/get?id=${rackId}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result.data);  // Assuming the response has a 'data' field
      } catch (error: any) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Ensure loading state is turned off
      }
    };

    fetchItems();
  }, [rackId]); // Use rackId in the dependency array

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <Breadcrumb location_id={data[0].location_id} />
          <div className="flex justify-start space-x-6 mb-4">
            <Link href={`/shelve/list/${rackId}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-200">
              List View
            </Link>
          </div>
          <RackID rackId={rackId} data={data} /> {/* Pass the rackId and data to RackID component */}
        </main>
      </div>
    </>
  );
}
