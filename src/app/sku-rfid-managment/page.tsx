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

const options = [
  { value: 0, label: 'Inactive' },  // Status 0
  { value: 1, label: 'Active' },     // Status 1
];

export default function Page() {
  const [data, setData] = useState([]); // Dữ liệu sẽ được lưu trữ ở đây
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneList, setZoneList] = useState<any[]>([]);

  const [selectedShelve, setSelectedShelve] = useState(null);
  const [shelveList, setShelveList] = useState<any[]>([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        // Construct the URL with selected filters

        if (selectedZone) params.append('zoneId', selectedZone.value);
        if (selectedShelve) params.append('shelveId', selectedShelve.value);
        if (selectedOption) params.append('status', selectedOption.value);

        const response = await fetch(`/api/shelves-and-bins?page=1&limit=${itemsPerPage}&${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result.data);
        setTotalCount(result.totalCount);
      } catch (err:any) {
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
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setZoneList(data.rows.map((zone: Zone) => ({
          value: zone.id,
          label: zone.name, // You might want to use sku.name here for better clarity
        })));
      } catch (err:any) {
        console.log(err.message);
      }
    };
    getDataZone();
  }, [currentPage, itemsPerPage]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleZoneChange = async (selectedOption:any) => {
    setSelectedZone(selectedOption);
    setSelectedShelve(null);
    try {
      const response = await fetch(`/api/shelves?zoneId=${selectedOption.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setShelveList(data.rows.map((shelve: Shelve) => ({
        value: shelve.id,
        label: shelve.name, // You might want to use sku.name here for better clarity
      })));
    } catch (error) {
      console.error('Error fetching shelves:', error);
    }
  };
  const handleShelveChange = (selectedOption:any) => {
    setSelectedShelve(selectedOption);
  };
  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // Construct the URL with selected filters

      if (selectedZone) params.append('zoneId', selectedZone.value);
      if (selectedShelve) params.append('shelveId', selectedShelve.value);
      if (selectedOption) params.append('status', selectedOption.value);

      const response = await fetch(`/api/shelves-and-bins?page=1&limit=${itemsPerPage}&${params.toString()}`);

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      setData(result.data);
      setTotalCount(result.totalCount);
      setCurrentPage(1); // Reset to the first page after search*/
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
        <h1 className="text-3xl font-bold mb-6 text-center">SKU & RFID managment​</h1>
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
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200`}
            >
              {'Search'}
            </button>
          </div>
        </div>
        <DataTable data={data} /> {/* Truyền dữ liệu vào DataTable */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} // Cập nhật trang hiện tại
        />
      </div>
    </>
  );
};

