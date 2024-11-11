'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  bin_stock_container_id: string; // Assuming this field is the one you want to check
}

interface DataTableProps {
  data: TableRow[];
  onEdit: (row: TableRow) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit }) => {
  console.log("data123", data);

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
            <tr key={index} className={`bg-gray-100`}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{row.name_location}</td>
              <td className="py-2 px-4 border-b">{row.name_shelve}</td>
              <td className="py-2 px-4 border-b">{row.name_bin}</td>
              <td className="py-2 px-4 border-b">{row.container_id}</td>
              <td className="py-2 px-4 border-b">
                {moment(row.fill_date).format('DD/MM/YYYY')}
              </td>
              <td className="py-2 px-4 border-b">{row.status}</td>
              <td className="border border-gray-300 p-2">
                {/* Check if bin_stock_container_id is not empty */}
                {row.bin_stock_container_id === null && (
                  <Link href={`/container-management/edit/${row.id}`} target="_blank">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                      RFID
                    </button>
                  </Link>
                )}

                {/* Check the status of the container */}
                {row.status === "Empty" ? (
                  <button className="bg-green-500 text-white px-2 py-1 rounded">
                    Full
                  </button>
                ) : (
                  <button className="bg-orange-500 text-white px-2 py-1 rounded">
                    Empty
                  </button>
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
    </div>
  );
};

export default DataTable;
