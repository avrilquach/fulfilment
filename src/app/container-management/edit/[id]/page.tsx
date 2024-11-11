"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Header from "../../../components/header";
import Sidebar from "../../../components/Sidebar";
import { useRouter, useParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";

interface ContainerData {
  container_id: string;
  location_name: string;
  shelve_name: string;
  bin_name: string;
  fill_date: string | null;
  status: string;
}

const EditDataPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState<ContainerData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [containerId, setContainerId] = useState('');
  const [firstContainerId, setFirstContainerId] = useState('');
  const [editData, setEditData] = useState<ContainerData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const loadEditData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/container-management/get/${id}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const allData: ContainerData[] = await response.json();
      setEditData(allData[0]);
      setSelectedDate(allData[0]?.fill_date ? new Date(allData[0].fill_date) : null);
      setContainerId(allData[0]?.container_id || '');
      setFirstContainerId(allData[0]?.container_id || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEditData();
  }, [loadEditData]);

  useEffect(() => {
    if (!firstContainerId) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/container-management/get/container-id/${firstContainerId}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const allData: ContainerData[] = await response.json();
        setData(allData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [firstContainerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if containerId is duplicate
      if (containerId && data?.some((item) => item.container_id === containerId)) {
        setError('Container ID already exists. Update not allowed.');
        setLoading(false);
        return;
      }

      // Determine the status based on editData and containerId presence
      let status;
      if (!containerId) {
        status = "Inactive";
      } else if (editData?.status === "Inactive" && containerId) {
        status = "Empty";
      }
      else{
        status = editData?.status;
      }

      // Construct the request body
      const requestBody = {
        container_id: containerId,
        status, // Set status based on the conditions above
      };

      const response = await fetch(`/api/container-management/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to update data');
      router.push('/container-management');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDateClick = () => {
    setSelectedDate(new Date());
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
              <span>{editData?.location_name}</span>
            </div>
            <div className="flex">
              <label className="block font-semibold mb-1 mr-1">Shelve:</label>
              <span>{editData?.shelve_name}</span>
            </div>
            <div className="flex">
              <label className="block font-semibold mb-1 mr-1">Bin:</label>
              <span>{editData?.bin_name}</span>
            </div>
            <div className="flex items-center space-x-2 hidden">
              <div>
                <label className="block font-semibold mb-1">Fill Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  dateFormat="dd/MM/yyyy"
                  className="border px-2 py-1 rounded"
                />
                <button
                  type="button"
                  onClick={handleNewDateClick}
                  className="bg-gray-300 text-black py-1 px-2 rounded"
                >
                  New Date
                </button>
              </div>
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
