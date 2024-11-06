// DataTable.tsx
'use client';
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Link from 'next/link';

interface TableRow {
  id: number;
  name_location: string;
  name_shelve: string;
  name_bin: string;
  container_id: string;
  status: number;
}

interface DataTableProps {
  data: TableRow[];
  onEdit: (row: TableRow) => void; // Add this line
}

const DataTable: React.FC<DataTableProps> = ({  data, onEdit }) => {

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
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Actions</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row,index) => (
            <tr key={index} className={`bg-gray-100`}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{row.name_location}</td>
              <td className="py-2 px-4 border-b">{row.name_shelve}</td>
              <td className="py-2 px-4 border-b">{row.name_bin}</td>
              <td className="py-2 px-4 border-b">{row.container_id}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
              <td className="border border-gray-300 p-2">
                <Link href={`/container-management/edit/${row.id}`}>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={13} className="py-2 px-4 border-b text-center">
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
