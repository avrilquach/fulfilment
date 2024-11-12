'use client';
import React from 'react';
import Link from 'next/link';
import moment from "moment";

interface TableRow {
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

interface DataTableProps {
  data: TableRow[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">Index</th>
          <th className="py-2 px-4 border-b text-left">Zone</th>
          <th className="py-2 px-4 border-b text-left">Shelve ID</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">Container RFID</th>
          <th className="py-2 px-4 border-b text-left">CM Part ID</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Qty/Container</th>
          <th className="py-2 px-4 border-b text-left">Unit</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Fill Date</th>
          <th className="py-2 px-4 border-b text-left">BU</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row,index) => {
            return (
              <tr key={index} className={`bg-gray-100`}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{row.location_name}</td>
                <td className="py-2 px-4 border-b">
                  <Link href={`/shelve/grid/${row.shelve_id}`} rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 font-semibold underline">
                    {row.shelve_id}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{row.bin_name}</td>
                <td className="py-2 px-4 border-b">{row.container_rfid}</td>
                <td className="py-2 px-4 border-b">{row.cm_part_id}</td>
                <td className="py-2 px-4 border-b">{row.cm_part_description}</td>
                <td className="py-2 px-4 border-b">{row.qty_per_container}</td>
                <td className="py-2 px-4 border-b">{row.unit}</td>
                <td className="py-2 px-4 border-b">{row.status}</td>
                <td className="py-2 px-4 border-b">{moment(row.fill_date).format('DD/MM/YYYY')}</td>
                <td className="py-2 px-4 border-b">{row.bu}</td>
              </tr>
            );
          })
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
