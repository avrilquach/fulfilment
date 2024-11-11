'use client';
import Header from '../components/header';
import React, { useEffect, useState } from 'react';
import Sidebar from "../components/business/Sidebar";
import DataTable from "../components/spend-tracker/DataTable";
import Pagination from "../components/pagination";
import Select from "react-select";
import moment from "moment";

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
  sku: string;
  rfid: string;
  qty: number;
  status: string;
  time: string;
  // Add other fields that match your data structure
}

export default function Page() {
  // Define state variables for data, pagination, Sku, time filters, and list of Sku options
  const [data, setData] = useState<DataItem[]>([]); // Define a better type for data
  const [dataTotal, setDataTotal] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSku, setSelectedSku] = useState<SkuOption | null>(null); // State for selected SKU
  const [skuList, setSkuList] = useState<SkuOption[]>([]); // Type the SKU list
  const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null); // State for selected time filter
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([]); // Type time options
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const pricePerUnit = 2; // Define a fixed price per unit

  // Fetch SKU list (replace with your API endpoint for SKUs)
  useEffect(() => {
    const fetchSkuList = async () => {
      setIsLoading(true); // Start loading
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
        setIsLoading(false); // Stop loading
      }
    };

    fetchSkuList();
  }, []);

  // Fetch time options (replace with your API or static time options)
  useEffect(() => {
    const fetchTimeOptions = async () => {
      setIsLoading(true); // Start loading
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
        setIsLoading(false); // Stop loading
      }
    };

    fetchTimeOptions();
  }, []);

  // Fetch data on page load or page change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const skuQuery = selectedSku ? `&sku=${selectedSku.value}` : ''; // Add SKU query if selected
        const timeQuery = selectedTime ? `&time=${selectedTime.value}` : ''; // Add time filter if selected
        const response = await fetch(`/api/spend-tracker?page=${currentPage}&limit=10${skuQuery}${timeQuery}`);
        const result = await response.json();
        const responseTotal = await fetch(`/api/spend-tracker/getAll`);
        const resultTotal = await responseTotal.json();
        setData(result.data); // Assuming `data` is in the result
        setDataTotal(resultTotal.rows);
        setTotalPages(Math.ceil(result.total[0].count / 10)); // Assuming `total` is the total count of items
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [currentPage, selectedSku, selectedTime]); // Fetch data whenever page, SKU, or time filter changes

  // Handle SKU selection change
  const handleSkuChange = (selectedOption: SkuOption | null) => {
    setSelectedSku(selectedOption); // Set selected SKU
  };

  // Handle Time selection change
  const handleTimeChange = (selectedOption: TimeOption | null) => {
    setSelectedTime(selectedOption); // Set selected time
  };

  // Function to calculate total value for "Empty" containers
  const calculateEmptyTotalValue = (data: DataItem[]) => {
    const emptyContainers = dataTotal.filter(item => item.status === 'Empty'); // Filter "Empty" containers
    return emptyContainers.length * pricePerUnit; // Multiply by price per unit
  };

  const totalValue = calculateEmptyTotalValue(data); // Call function to calculate total value for "Empty" containers


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
              {/* Total value for empty containers */}
              <div className="mt-4 p-4 bg-gray-100 rounded flex items-center">
                <h2 className="text-lg font-semibold">Total Value for Empty Containers:</h2>
                <p className="text-xl font-bold ml-4">{totalValue.toFixed(2)} USD</p>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
