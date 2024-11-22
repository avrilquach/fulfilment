'use client';
import Header from './components/header';
import React, { useEffect, useState } from 'react';
import Sidebar from "./components/business/Sidebar";

interface BusinessDataItem {
  location_name: string;
  full_count?: number;
  shelve_count?: number;
  total_container_count?: number;
  total_empty_full_count?: number;
  progress?: number; // Assuming there's a field for progress in the data if available
}

export default function Page() {
  // Specify the type of `data` as `BusinessDataItem[]`
  const [data, setData] = useState<BusinessDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/business');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Specify the type for `result`
        const result: { rows: BusinessDataItem[] } = await response.json();
        setData(result.rows);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-6 w-full lg:w-[80%] bg-gray-50">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">WTC</h1>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, index) => {
                const progress =
                  item.full_count && item.total_empty_full_count
                    ? (item.full_count * 100) / item.total_empty_full_count
                    : 0; // Safely calculate progress
                return (
                  <div key={index} className="p-6 bg-white border rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.location_name}</h2>
                    <p className="text-gray-700">Shelves qty.: {item.shelve_count ?? 'N/A'}</p>
                    <p className="text-gray-700">Containers qty.: {item.total_container_count ?? 'N/A'}</p>
                    <p className="text-gray-700 mt-2">Item Balance status:</p>
                    <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden mt-2">
                      <div
                        className="bg-green-500 h-full text-center text-white text-sm font-medium flex items-center justify-center transition-all"
                        style={{ width: `${progress}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
