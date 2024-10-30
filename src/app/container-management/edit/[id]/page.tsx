"use client"; // Specify that this is a client component
import React, { useEffect, useState } from 'react';
import Header from "../../../components/header";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; // Import useParams
import Select from "react-select";

const EditDataPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the ID from the URL using useParams
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [containerId, setContainerId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<any>({ value: 'Inactive', label: 'Inactive' });

  // Status options
  const statusOptions = [
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Empty', label: 'Empty' },
    { value: 'Full', label: 'Full' },
  ];

  // Gọi API để lấy dữ liệu khi component được tải
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/container-management/getAll');
        if (!response.ok) throw new Error('Failed to fetch data');
        const allData = await response.json();
        setData(allData); // Cập nhật state với dữ liệu lấy được
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
  };

  const checkContainerIdExists = (containerId: string): boolean => {
    // Kiểm tra xem containerId có tồn tại trong data hay không
    return data ? data.some((item: any) => item.container_id === containerId) : false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if containerId exists in the database
      if(containerId){
        const exists = await checkContainerIdExists(containerId);
        if (exists) {
          setError('Container ID already exists. Update not allowed.');
          setLoading(false);
          return; // Prevent further processing
        }
      }

      const response = await fetch(`/api/container-management/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          container_id: containerId,
          status: selectedStatus.value, // Use selectedStatus.value for status
        }),
      });

      if (!response.ok) throw new Error('Failed to update data');

      // Redirect to container management page after successful update
      router.push('/container-management');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <h2 className="text-xl font-semibold mb-4">Edit Container Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Container ID</label>
              <input
                type="text"
                value={containerId}
                onChange={(e) => setContainerId(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter container ID"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Status</label>
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                options={statusOptions}
                isClearable
                placeholder="Select status"
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {loading ? 'Updating...' : 'Update Data'}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default EditDataPage;
