"use client"
import { useState, useEffect } from 'react';
import Header from '../components/header';
import Sidebar from "../components/business/Sidebar";
import DataTable from "../components/spend-tracker/DataTable";
import Pagination from "../components/pagination";
import Select from "react-select";
import moment from "moment";
import * as XLSX from 'xlsx'; // Import thư viện xlsx

// Define the types for SKU and Time options
interface SkuOption {
  value: string;
  label: string;
}

interface TimeOption {
  value: string;
  label: string;
}

interface DataItem {
  id: number;
  part_id: string;
  sku: string;
  rfid: string;
  qty: number;
  status: string;
  time: string;
  // Add other fields that match your data structure
}

export default function Page() {
  const [data, setData] = useState<DataItem[]>([]); // Define a better type for data
  const [dataTotal, setDataTotal] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSku, setSelectedSku] = useState<SkuOption | null>(null);
  const [skuList, setSkuList] = useState<SkuOption[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pricePerUnit = 2;

  // Fetch SKU list (replace with your API endpoint for SKUs)
  useEffect(() => {
    const fetchSkuList = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/spend-tracker/sku');
        const result = await response.json();
        setSkuList(result.rows.map((sku: { sku: string }) => ({
          value: sku.sku,
          label: sku.sku,
        })));
      } catch (error) {
        console.error("Error fetching SKUs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkuList();
  }, []);

  // Fetch time options
  useEffect(() => {
    const fetchTimeOptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/spend-tracker/time');
        const result = await response.json();
        setTimeOptions(result.rows.map((time: { time: string }) => ({
          value: moment(time.time).format('YYYY-MM-DD'),
          label: moment(time.time).format('DD/MM/YYYY'),
        })));
      } catch (error) {
        console.error("Error fetching time options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeOptions();
  }, []);

  // Fetch data on page load or page change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const skuQuery = selectedSku ? `&sku=${selectedSku.value}` : '';
        const timeQuery = selectedTime ? `&time=${selectedTime.value}` : '';
        const response = await fetch(`/api/spend-tracker?page=${currentPage}&limit=10${skuQuery}${timeQuery}`);
        const result = await response.json();
        const responseTotal = await fetch(`/api/spend-tracker/getAll`);
        const resultTotal = await responseTotal.json();
        setData(result.data);
        setDataTotal(resultTotal.rows);
        setTotalPages(Math.ceil(result.total[0].count / 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedSku, selectedTime]);

  // Handle SKU selection change
  const handleSkuChange = (selectedOption: SkuOption | null) => {
    setSelectedSku(selectedOption);
  };

  // Handle Time selection change
  const handleTimeChange = (selectedOption: TimeOption | null) => {
    setSelectedTime(selectedOption);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataTotal); // Data to export
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Save as Excel file
    XLSX.writeFile(wb, "Spend_Tracker_Data.xlsx");
  };

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-6 w-full lg:w-[80%] bg-gray-50">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Sku</label>
              <Select
                id="skuList"
                value={selectedSku}
                onChange={handleSkuChange}
                options={skuList}
                placeholder="Select SKU"
                isClearable
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Time</label>
              <Select
                id="timeFilter"
                value={selectedTime}
                onChange={handleTimeChange}
                options={timeOptions}
                placeholder="Select Time"
                isClearable
              />
            </div>
            <button
              className="ml-4 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>

          </div>
          <h1 className="text-2xl font-semibold mb-4">Spend Tracker</h1>

          {/* Loading indicator */}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <DataTable data={data} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </>
  );
}
