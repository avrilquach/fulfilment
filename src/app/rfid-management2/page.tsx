'use client';
import Header from '../components/header';
import SkuRfidManager from '../components/skurfidmanager';
import DataTable from '../components/rfid-management/DataTable';
import Pagination from '../components/pagination';
import { useEffect, useState, useCallback } from 'react';

export default function Page() {
  const [data, setData] = useState([]); // Dữ liệu sẽ được lưu trữ ở đây
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/parts?page=${currentPage}&limit=${itemsPerPage}`);
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

  if (loading) return <div className="loader">Loading...</div>;
  if (error) {
    return (
      <div>
        <div>Error: {error}</div>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSave = async () => {
    await fetchData();
  };
  return (
    <>
      <Header />
      <div className="grid gap-4 grid-cols-4 p-4">
        <div className="col-span-1">
          <SkuRfidManager onSave={handleSave}/>
        </div>
        <div className="col-span-3">
          <DataTable data={data} /> {/* Truyền dữ liệu vào DataTable */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} // Cập nhật trang hiện tại
          />
        </div>
      </div>
    </>
  );
}
