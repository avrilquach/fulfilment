"use client"; // Specify that this is a client component
import React, { useEffect, useState, useCallback } from 'react';
import Header from "../components/header";
import DataTable from "../components/container-management/DataTable";
import Pagination from "../components/pagination";
import Select from "react-select";
import Sidebar from "../components/Sidebar";
import AddRfidData from "../components/container-management/AddRfidData";
import Link from 'next/link'; // Import Link

interface Option {
  value: string;
  label: string;
}

interface Location {
  id: number;
  name: string;
}

interface Shelve {
  id: number;
  name: string;
}

const options: Option[] = [
  { value: '', label: 'All' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Empty', label: 'Empty' },
  { value: 'Full', label: 'Full' },
];

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [editData, setEditData] = useState<any | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [locationList, setLocationList] = useState<Option[]>([]);

  const [selectedShelve, setSelectedShelve] = useState<Option | null>(null);
  const [shelveList, setShelveList] = useState<Option[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedOption) params.append('status', selectedOption.value);
      if (selectedLocation) params.append('location', selectedLocation.value);
      if (selectedShelve) params.append('shelve', selectedShelve.value);

      const response = await fetch(`/api/container-management?page=${currentPage}&limit=${itemsPerPage}&${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      setData(result.data);
      setTotalCount(result.total[0].count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedOption, selectedLocation, selectedShelve]); // Updated dependencies

  const getDataLocation = async () => {
    try {
      const response = await fetch('/api/container-management/location/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      const locationsWithAll = [
        { value: '', label: 'All' }, // Add "All" option
        ...data.rows.map((location: Location) => ({
          value: location.id,
          label: location.name,
        })),
      ];
      setLocationList(locationsWithAll);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchData();
    getDataLocation();
  }, [fetchData]);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const refreshData = () => {
    fetchData();
  };

  const handleEdit = (row: any) => {
    setEditData(row);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleLocationChange = async (selectedOption: Option | null) => {
    setSelectedLocation(selectedOption);
    setSelectedShelve(null);
    setShelveList([]);
    setCurrentPage(1);
    if (!selectedOption) return;
    if(selectedOption.value)
    {
      try {
        const response = await fetch(`/api/container-management/shelves?zoneId=${selectedOption.value}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setShelveList(data.rows.map((shelve: Shelve) => ({
          value: shelve.id,
          label: shelve.name,
        })));
      } catch (error) {
        console.error('Error fetching shelves:', error);
      }
    }
  };

  const handleShelveChange = (selectedOption: Option | null) => {
    setCurrentPage(1);
    setSelectedShelve(selectedOption);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Location</label>
              <Select
                id="locationList"
                value={selectedLocation}
                onChange={handleLocationChange}
                options={locationList}
                placeholder="Location"
                isClearable
              />
              <Link href="/container-management/location">
                <button className="hidden mt-4 mb-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200 ease-in-out">
                  Add Location
                </button>
              </Link>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Shelve</label>
              <Select
                id="shelveList"
                value={selectedShelve}
                onChange={handleShelveChange}
                options={shelveList}
                placeholder="Select Shelve"
                isClearable
              />
            </div>
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
          <Link href="/container-management/add">
            <button className="mb-4 inline-block bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 transition duration-200 ease-in-out">
              Add New Data
            </button>
          </Link>
          <DataTable data={data} onEdit={handleEdit} />
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
