"use client"; // Specify that this is a client component
import React, { useEffect, useState, useCallback } from 'react';
import Header from "../../../components/header";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Select from "react-select";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";

const EditDataPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [containerId, setContainerId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<any>({ value: 'Inactive', label: 'Inactive' });
  const [editData, setEditData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  const statusOptions = [
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Empty', label: 'Empty' },
    { value: 'Full', label: 'Full' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/container-management/getAll');
      if (!response.ok) throw new Error('Failed to fetch data');
      const allData = await response.json();
      setData(allData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEditData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/container-management/get/${id}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const allData = await response.json();
      setEditData(allData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    loadEditData();
  }, [fetchData, loadEditData]); // Include loadEditData here

  const handleStatusChange = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
  };

  const checkContainerIdExists = (containerId: string): boolean => {
    return data ? data.some((item: any) => item.container_id === containerId) : false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (containerId) {
        const exists = checkContainerIdExists(containerId);
        if (exists) {
          setError('Container ID already exists. Update not allowed.');
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/container-management/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          container_id: containerId,
          status: selectedStatus.value,
          fill_date: moment(selectedDate).format('YYYY-MM-DD HH:mm:ss'),
        }),
      });

      if (!response.ok) throw new Error('Failed to update data');

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
            <div className="flex">
              <label className="block font-semibold mb-1 mr-1">Location:</label>
              <span>{editData && editData[0]?.location_name}</span>
            </div>
            <div className="flex">
              <label className="block font-semibold mb-1 mr-1">Shelve:</label>
              <span>{editData && editData[0]?.shelve_name}</span>
            </div>
            <div className="flex">
              <label className="block font-semibold mb-1 mr-1">Bin:</label>
              <span>{editData && editData[0]?.bin_name}</span>
            </div>
            <div>
              <label className="block font-semibold mb-1">Fill Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="border px-2 py-1 rounded"
              />
            </div>
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
