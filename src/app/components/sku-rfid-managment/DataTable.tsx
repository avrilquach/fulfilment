// DataTable.tsx
'use client';
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

interface TableRow {
  zone_id: number;
  zone_name: string;
  shelve_id: number;
  shelve_name: string;
  bin_id: number;
  bin_name: string;
  status: number;
}

interface DataTableProps {
  data: TableRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">Zone ID</th>
          <th className="py-2 px-4 border-b text-left">Zone Name</th>
          <th className="py-2 px-4 border-b text-left">Shelve ID</th>
          <th className="py-2 px-4 border-b text-left">Shelve Name</th>
          <th className="py-2 px-4 border-b text-left">Bin ID</th>
          <th className="py-2 px-4 border-b text-left">Bin Name</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row,index) => (
            <tr key={index} className={`bg-gray-100`}>
              <td className="py-2 px-4 border-b">{row.zone_id}</td>
              <td className="py-2 px-4 border-b">{row.zone_name}</td>
              <td className="py-2 px-4 border-b">{row.shelve_id}</td>
              <td className="py-2 px-4 border-b">{row.shelve_name}</td>
              <td className="py-2 px-4 border-b">{row.bin_id}</td>
              <td className="py-2 px-4 border-b">{row.bin_name}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
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
