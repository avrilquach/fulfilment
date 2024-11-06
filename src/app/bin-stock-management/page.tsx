'use client';
import Header from '../components/header';
import SkuRfidManager from '../components/bin-stock-management/skurfidmanager';
import DataTable from '../components/bin-stock-management/DataTable';
import Pagination from '../components/pagination';
import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from "../components/Sidebar";

export default function Page() {
  const [data, setData] = useState([]); // Dữ liệu sẽ được lưu trữ ở đây
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/bin-stock-management?page=${currentPage}&limit=${itemsPerPage}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result.data);
      setTotalCount(result.totalCount);
    } catch (error: any) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]); // Add dependencies here

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Now you can safely include fetchData here

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSaveComplete = () => {
    fetchData(); // Refresh the data after saving
  };

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-5">
          <div>
            <SkuRfidManager onSaveComplete={handleSaveComplete}/>
            <div className="col-span-3">
              <DataTable data={data} /> {/* Truyền dữ liệu vào DataTable */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage} // Cập nhật trang hiện tại
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
