// DataTable.tsx
'use client';
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SelectedRow from '../SelectedRow'; // Import SelectedRow component

interface TableRow {
  id: number;
  cm_part_id: string;
  tat_sku: string;
  cm_part_description: string;
  min_stock: number;
  unit: string;
  status: string;
  fill_date: string;
  bu: string;
  location_name:string;
  shelve_name: string;
  bin_id: string;
  bin_name:string;
  container_rfid: string;
}

interface DataTableProps {
  data: TableRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">Index</th>
          <th className="py-2 px-4 border-b text-left">CM Part ID</th>
          <th className="py-2 px-4 border-b text-left">TAT SKU</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Qty/Container</th>
          <th className="py-2 px-4 border-b text-left">Unit</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Fill Date</th>
          <th className="py-2 px-4 border-b text-left">BU</th>
          <th className="py-2 px-4 border-b text-left">Zone</th>
          <th className="py-2 px-4 border-b text-left">Shelve ID</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">Container RFID</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row,index) => (
            console.log(row),
            <tr key={index} className={`bg-gray-100`}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{row.cm_part_id}</td>
              <td className="py-2 px-4 border-b">{row.tat_sku}</td>
              <td className="py-2 px-4 border-b">{row.cm_part_description}</td>
              <td className="py-2 px-4 border-b">{row.min_stock}</td>
              <td className="py-2 px-4 border-b">{row.unit}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
              <td className="py-2 px-4 border-b">{moment(row.fill_date).format('DD/MM/YYYY')}</td>
              <td className="py-2 px-4 border-b">{row.bu}</td>
              <td className="py-2 px-4 border-b">{row.location_name}</td>
              <td className="py-2 px-4 border-b">{row.shelve_name}</td>
              <td className="py-2 px-4 border-b">{row.bin_name}</td>
              <td className="py-2 px-4 border-b">{row.container_rfid}</td>
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
