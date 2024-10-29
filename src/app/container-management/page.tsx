"use client"; // Specify that this is a client component
import React, { useEffect, useState, useCallback } from 'react';
import Header from "../components/header";
import DataTable from "../components/container-management/DataTable";
import Pagination from "../components/pagination";
import Select from "react-select";
import Sidebar from "../components/Sidebar";
import AddRfidData from "../components/container-management/AddRfidData";

interface Option {
  value: string;
  label: string;
}

interface Location {
  location: string;
}

interface Shelve {
  shelve: string;
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
  const [itemsPerPage] = useState<number>(15);
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
      const response = await fetch('/api/container-management/location', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      const locationsWithAll = [
        { value: '', label: 'All' }, // Add "All" option
        ...data.rows.map((location: Location) => ({
          value: location.location,
          label: location.location,
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

    try {
      const response = await fetch(`/api/container-management/shelves?location=${selectedOption.value}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setShelveList(data.rows.map((shelve: Shelve) => ({
        value: shelve.shelve,
        label: shelve.shelve,
      })));
    } catch (error) {
      console.error('Error fetching shelves:', error);
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
        <main className="p-4 w-[80%] flex gap-4">
          <div className="w-[25%]">
            <AddRfidData onAddSuccess={refreshData} initialData={editData} />
          </div>
          <div className="w-[75%]">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-1">Location</label>
                <Select
                  id="locationList"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  options={locationList}
                  placeholder="Location"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Shelve</label>
                <Select
                  id="shelveList"
                  value={selectedShelve}
                  onChange={handleShelveChange}
                  options={shelveList}
                  placeholder="Select Shelve"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <Select
                  id="statusList"
                  value={selectedOption}
                  onChange={handleChange}
                  options={options}
                  placeholder="Status"
                />
              </div>
            </div>
            <DataTable data={data} onEdit={handleEdit} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </>
  );
}
