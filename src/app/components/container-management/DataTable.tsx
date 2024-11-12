import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import Link from 'next/link';

interface TableRow {
  id: number;
  name_location: string;
  name_shelve: string;
  name_bin: string;
  container_id: string;
  status: string;
  fill_date: string;
  bin_stock_container_id: string;
  tat_sku: string;
}

interface DataTableProps {
  data: TableRow[];
  onEdit: (row: TableRow) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit }) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);

  // Function to handle status button click and call API
  const handleStatusClick = async (row: TableRow) => {
    const newStatus = 'Full' ;
    setLoadingId(row.id);  // Show loading animation for this button

    try {
      const response = await fetch('/api/container-management/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: row.id,
          status: newStatus,
          container_rfid: row.container_id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        // Refresh the page using window.location.href
        window.location.href = '/container-management';  // This reloads the page
      } else {
        console.error('API error:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingId(null);  // Hide loading animation
    }
  };

  const handleFulfillClick = (row: TableRow) => {
    setSelectedRow(row);  // Set the selected row to show in modal
    setShowModal(true);  // Show the modal
  };

  const handleConfirmFulfill = async () => {
    if (!selectedRow) return;

    // Call the status update function
    await handleStatusClick({
      ...selectedRow,
      status: 'Full', // Set status to 'Full'
      fill_date: moment().format('DD/MM/YYYY'), // Set current date as fill date
    });

    setShowModal(false);  // Close modal after confirming
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">Index</th>
          <th className="py-2 px-4 border-b text-left">Location</th>
          <th className="py-2 px-4 border-b text-left">Shelve</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">Container ID</th>
          <th className="py-2 px-4 border-b text-left">Fill Date</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Actions</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr key={index} className="bg-gray-100">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{row.name_location}</td>
              <td className="py-2 px-4 border-b">{row.name_shelve}</td>
              <td className="py-2 px-4 border-b">{row.name_bin}</td>
              <td className="py-2 px-4 border-b">{row.container_id}</td>
              <td className="py-2 px-4 border-b">
                {moment(row.fill_date).format('DD/MM/YYYY')}
              </td>
              <td className="py-2 px-4 border-b">
                <div
                  className={`text-white text-center px-2 py-1 rounded ${
                    row.status === 'Inactive'
                      ? 'bg-gray-500'
                      : row.status === 'Empty'
                        ? 'bg-red-500'
                        : row.status === 'Full'
                          ? 'bg-green-500' // Fix for Full status
                          : 'bg-gray-500'
                  }`}
                >
                  {row.status}
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                {(row.status === 'Empty' || row.status === 'Inactive') && (
                  <>
                    <Link href={`/container-management/edit/${row.id}`} target="_blank">
                      <button className="text-black px-2 py-1 rounded mr-2">
                        Edit
                      </button>
                    </Link>
                    {row.bin_stock_container_id && (
                      <button
                        onClick={() => handleFulfillClick(row)} // Calling the modal show function
                        className="text-black px-2 py-1 rounded mr-2"
                      >
                        Fulfill
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8} className="py-2 px-4 border-b text-center">
              No data available
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {/* Modal for Fulfill confirmation */}
      {showModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Do you want to use this RFID to fill the container?
            </h2>
            <div className="mb-4">
              <p><strong>Status:</strong> Full</p>
              <p><strong>Fill Date:</strong> {moment().format('DD/MM/YYYY')}</p>
              <p><strong>SKU:</strong>{selectedRow.tat_sku}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmFulfill}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)} // Close the modal
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
