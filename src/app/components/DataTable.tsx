// src/app/components/DataTable.tsx

import React from 'react';
import moment from 'moment';

interface TableRow {
  cm_part_id: number;
  name: string;
  qty_container: number;
  unit: string;
  status: string;
  fill_date: string;
  bu: string;
  zone: string;
  shelve_id: string;
  bin: string;
  tat_sku: string;
  container_rfid: string;
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
          <th className="py-2 px-4 border-b text-left">CM Part ID</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Qty/Container</th>
          <th className="py-2 px-4 border-b text-left">Unit</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Fill Date</th>
          <th className="py-2 px-4 border-b text-left">BU</th>
          <th className="py-2 px-4 border-b text-left">Zone</th>
          <th className="py-2 px-4 border-b text-left">Shelve ID</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">TAT SKU</th>
          <th className="py-2 px-4 border-b text-left">Container RFID</th>
        </tr>
        </thead>
        <tbody>
        {data.map((row) => (
          <tr key={row.cm_part_id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{row.cm_part_id}</td>
            <td className="py-2 px-4 border-b">{row.name}</td>
            <td className="py-2 px-4 border-b">{row.qty_container}</td>
            <td className="py-2 px-4 border-b">{row.unit}</td>
            <td className="py-2 px-4 border-b">{row.status}</td>
            <td className="py-2 px-4 border-b">{moment(row.fill_date).format('DD/MM/YYYY')}</td>
            <td className="py-2 px-4 border-b">{row.bu}</td>
            <td className="py-2 px-4 border-b">{row.zone}</td>
            <td className="py-2 px-4 border-b">{row.shelve_id}</td>
            <td className="py-2 px-4 border-b">{row.bin}</td>
            <td className="py-2 px-4 border-b">{row.tat_sku}</td>
            <td className="py-2 px-4 border-b">{row.container_rfid}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
