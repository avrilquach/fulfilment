// pages/items/[id].tsx or wherever your ItemsPage is located
"use client";
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../../components/header';
import Sidebar from "../../../components/business/Sidebar";
import Pagination from "../../../components/pagination";
import Link from "next/link";
import { useParams } from "next/navigation";
import DataTable from "../../../components/business/shelve/DataTable";
import RackID from "../../../components/business/shelve/RackID";
import Breadcrumb from "../../../components/business/Breadcrumb";
import Select from "react-select"; // Import the new RackID component


interface Option {
  value: string;
  label: string;
}

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
  shelve_name: string;
}

const options: Option[] = [
  { value: '', label: 'All' },
  { value: 'Empty', label: 'Empty' },
  { value: 'Full', label: 'Full' },
];

export default function ItemsPage() {
  const { id } = useParams();
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [containerRfid, setContainerRfid] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const params = new URLSearchParams();
      if (selectedOption) params.append('status', selectedOption.value);
      const response = await fetch(`/api/business/shelve/pager?id=${id}&page=${currentPage}&limit=10&${params.toString()}`);
      const result = await response.json();
      if (!response.ok) throw new Error('Failed to fetch data');
      setData(result.data);
      setTotalPages(Math.ceil(result.total[0].count / 10));
    } catch (error: any) {
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Ensure loading state is turned off
    }
  }, [id,currentPage, selectedOption]); // Updated dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <Breadcrumb location_id={data[0].location_id} />
          <div className="flex justify-start space-x-6 mb-4">
            <Link href={`/shelve/grid/${id}`} rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-200">
              Grid View
            </Link>
          </div>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Status</label>
              <Select
                id="statusList"
                value={selectedOption}
                onChange={handleChange}
                options={options}
                placeholder="Status"
                isClearable
              />
            </div>
          </div>
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
