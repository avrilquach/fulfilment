// DataTable.tsx
'use client';
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SelectedRow from '../SelectedRow'; // Import SelectedRow component

interface TableRow {
  id: number;
  sku: string;
  rfid: string;
  qty: number;
  status: string;
  time: string;
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
          <th className="py-2 px-4 border-b text-left">TAT SKU</th>
          <th className="py-2 px-4 border-b text-left">Container RFID</th>
          <th className="py-2 px-4 border-b text-left">Qty/Container</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Time</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <tr key={row.id}>
              <td className="py-2 px-4 border-b">{row.sku}</td>
              <td className="py-2 px-4 border-b">{row.rfid}</td>
              <td className="py-2 px-4 border-b">{row.qty}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
              <td className="py-2 px-4 border-b">{moment(row.time).format('DD/MM/YYYY')}</td>
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
