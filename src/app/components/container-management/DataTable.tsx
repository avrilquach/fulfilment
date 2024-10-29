// DataTable.tsx
'use client';
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

interface TableRow {
  id: number;
  location: string;
  shelve: string;
  bin: string;
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
          <th className="py-2 px-4 border-b text-left">ID</th>
          <th className="py-2 px-4 border-b text-left">Location</th>
          <th className="py-2 px-4 border-b text-left">Shelve</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">Container ID</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left"></th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row,index) => (
            <tr key={index} className={`bg-gray-100`}>
              <td className="py-2 px-4 border-b">{row.id}</td>
              <td className="py-2 px-4 border-b">{row.location}</td>
              <td className="py-2 px-4 border-b">{row.shelve}</td>
              <td className="py-2 px-4 border-b">{row.bin}</td>
              <td className="py-2 px-4 border-b">{row.container_id}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="text-blue-500"
                  onClick={() => onEdit(row)}>Edit</button>
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
