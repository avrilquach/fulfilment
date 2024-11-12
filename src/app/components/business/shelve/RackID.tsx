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
}

interface RackIDProps {
  rackId: string;
  data: BinData[];
}

const RackID: React.FC<RackIDProps> = ({ rackId, data }) => {
  const rowColors = ['', 'bg-[#f6a21e]'];
  const inputRef = useRef<HTMLInputElement>(null);
  const [rfidInput, setRfidInput] = useState('');
  const [error, setError] = useState<string | null>(null); // Error state

  const chunkData = (data: BinData[], chunkSize: number) => {
    const result: BinData[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  const chunkedData = chunkData(data, 5);

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
        Rack ID: {rackId}
      </div>

      {/* Display error message if exists */}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

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

      <div className="text-center text-sm font-semibold text-gray-600 mb-4 tracking-wider">⬆ EMPTY BINS ⬆</div>

      <div className="space-y-3">
        {chunkedData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {row.map((bin, binIndex) => {
              const isFull = bin.status === 'Full';
              const binColor = isFull ? rowColors[0] : rowColors[1];

              return (
                <div
                  key={binIndex}
                  className={`relative ${binColor} p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out`}
                >
                  <div className="flex flex-col items-center justify-center text-white space-y-2">
                    <div className="font-bold text-xl text-center">
                      {bin.bin_name || `Bin ${binIndex + 1}`}
                    </div>

                    {/* Show the additional information in a separate section */}
                    <div className="mt-4 space-y-2 text-sm text-white bg-gray-700 p-3 rounded-lg shadow-md w-full">
                      <div className="flex justify-between">
                        <span className="font-semibold">Part ID:</span>
                        <span>{bin.cm_part_id}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Description:</span>
                        <span>{bin.cm_part_description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">RFID:</span>
                        <span>{bin.container_rfid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Qty:</span>
                        <span>{bin.qty_per_container}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded"></div>
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
