import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface BinData {
  location_name: string;
  shelve_id: number;
  bin_name: string;
  container_rfid: string;
  cm_part_id: string;
  cm_part_description: string;
  qty_per_container: number;
  unit: string;
  status: string;
  fill_date: string;
  bu: string;
  tat_sku: string;
}

interface RackIDProps {
  rackId: string;
  rackName: string;
  data: BinData[];
}

const RackID: React.FC<RackIDProps> = ({ rackId, rackName, data }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rfidInput, setRfidInput] = useState('');
  const [error, setError] = useState<string | null>(null); // Error state

  const chunkDataByRows = (data: BinData[], rowSizes: number[]) => {
    const result: BinData[][] = [];
    let index = 0;

    rowSizes.forEach((rowSize) => {
      if (index < data.length) {
        result.push(data.slice(index, index + rowSize));
        index += rowSize;
      }
    });

    return result;
  };

  const rowSizes = [ 9, 9,7,7,5,5]; // Số phần tử cho từng dòng
  const chunkedData = chunkDataByRows(data, rowSizes);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error state before each submission
    const newStatus = 'Empty';

    try {
      const response = await fetch('/api/business/shelve/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          container_rfid: rfidInput,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = `/shelve/grid/${rackId}`;
      } else {
        console.log("result123",result);
        setError(result.message || 'Failed to update status');
        setRfidInput('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while updating the status');
    }
  };

  return (
    <div className="w-full mx-auto border-4 border-gray-800 rounded-lg shadow-lg p-4 bg-gray-50 mb-4">
      <div className="bg-gray-200 text-black font-extrabold text-2xl py-3 rounded-lg shadow-md mb-2 text-center transition-colors duration-300 mb-4">
        Rack ID: {rackName}
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <input
            id="searchBin"
            ref={inputRef}
            type="text"
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            placeholder="Enter RFID"
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="hidden w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
      {/* Display error message if exists */}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {chunkedData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-9 gap-4">
            {row.map((bin, binIndex) => {
              // Determine background color based on the RFID and status conditions
              const binColor = !bin.container_rfid
                ? 'bg-white'
                : bin.status === 'Full'
                  ? 'bg-blue-500 text-white'
                  : 'bg-red-500 text-white';

              return (
                <div
                  key={binIndex}
                  className={`p-2 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-200 ease-in-out ${binColor}`}
                >
                  {/* Main bin information - positioned on the left */}
                  <div className="flex items-center space-x-3">
                    <div className="absolute left-0 top-0 w-7 h-7 flex items-center justify-center bg-gray-200 text-black rounded-xl">
                      {/* Bin number on the left side */}
                      <span className="font-semibold text-sm">{bin.bin_name || `Bin ${binIndex + 1}`}</span>
                    </div>
                  </div>

                  {/* Tooltip (always visible) without absolute positioning */}
                  <div className={`w-full space-y-1 p-3 text-sm text-gray-100 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg ${bin.cm_part_id ? '' : 'opacity-0'}`}>
                    <div>
                      <span className={"block"}>{bin.tat_sku}</span>
                      <p className={"truncate w-24"}>{bin.cm_part_description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RackID;
