"use client"; // Chỉ định rằng đây là một component client
import React, { useEffect, useState } from 'react';
import Header from "../components/header";
import DataTable from "../components/sku-rfid-managment/DataTable";
import Pagination from "../components/pagination";
import Select from "react-select";

interface Zone {
  id: number;
  name: string;
}

interface Shelve {
  id: number;
  name: string;
}

interface Option {
  value: number;
  label: string;
}

const options: Option[] = [
  { value: 0, label: 'Inactive' },
  { value: 1, label: 'Active' },
];

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [zoneList, setZoneList] = useState<Option[]>([]);

  const [selectedShelve, setSelectedShelve] = useState<Option | null>(null);
  const [shelveList, setShelveList] = useState<Option[]>([]);

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (selectedZone) params.append('zoneId', selectedZone.value.toString());
        if (selectedShelve) params.append('shelveId', selectedShelve.value.toString());
        if (selectedOption) params.append('status', selectedOption.value.toString());

        const response = await fetch(`/api/shelves-and-bins?page=${currentPage}&limit=${itemsPerPage}&${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result.data);
        setTotalCount(result.total[0].count);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const getDataZone = async () => {
      try {
        const response = await fetch('/api/zone', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setZoneList(data.rows.map((zone: Zone) => ({
          value: zone.id,
          label: zone.name,
        })));
      } catch (err: any) {
        console.log(err.message);
      }
    };
    getDataZone();
  }, [currentPage, itemsPerPage, selectedOption, selectedShelve, selectedZone]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleZoneChange = async (selectedOption: Option | null) => {
    setSelectedZone(selectedOption);
    setSelectedShelve(null);
    if (!selectedOption) return; // Kiểm tra nếu không có zone được chọn

    try {
      const response = await fetch(`/api/shelves?zoneId=${selectedOption.value}`, {
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
  };

  const handleShelveChange = (selectedOption: Option | null) => {
    setSelectedShelve(selectedOption);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedZone) params.append('zoneId', selectedZone.value.toString());
      if (selectedShelve) params.append('shelveId', selectedShelve.value.toString());
      if (selectedOption) params.append('status', selectedOption.value.toString());

      const response = await fetch(`/api/shelves-and-bins?page=1&limit=${itemsPerPage}&${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      setData(result.data);
      setTotalCount(result.total[0].count);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">SKU & RFID Management</h1>
        <div className="grid mb-6 grid-cols-4 gap-4">
          <div>
            <Select
              id="zoneList"
              value={selectedZone}
              onChange={handleZoneChange}
              options={zoneList}
              placeholder="Select Zone"
            />
          </div>
          <div>
            <Select
              id="shelveList"
              value={selectedShelve}
              onChange={handleShelveChange}
              options={shelveList}
              placeholder="Select Shelve"
            />
          </div>
          <div>
            <Select
              id="statusList"
              value={selectedOption}
              onChange={handleChange}
              options={options}
              placeholder="Select Status"
            />
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
        <DataTable data={data} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
