'use client';
import React from 'react';
import Link from 'next/link';

interface TableRow {
  location: string;
  shelve: string;
  bin_names: string;
  cm_part_id: number;
  tat_sku: number;
  product_link: string;
  cm_part_description: string;
  qty: number;
  max_stock: number;
  unit: string;
  progress?: number;  // Optional progress
  fullfilment_triggered?: string; // Optional column for fulfillment status
  full_count: number;  // Full count
  empty_count: number; // Empty count
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
          <th className="py-2 px-4 border-b text-left">Location</th>
          <th className="py-2 px-4 border-b text-left">Shelve</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">CM Part ID</th>
          <th className="py-2 px-4 border-b text-left">TAT SKU</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Qty</th>
          <th className="py-2 px-4 border-b text-left">Max Qty</th>
          <th className="py-2 px-4 border-b text-left">Unit</th>
          <th className="py-2 px-4 border-b text-left">Stock Status</th>
          <th className="py-2 px-4 border-b text-left">Fullfilment Triggered</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row) => {
            // Calculate the 'process' value
            const process = (row.full_count + row.empty_count) > 0
              ? (row.full_count * 100) / (row.full_count + row.empty_count)
              : 0;

            return (
              <tr key={row.cm_part_id} className={`bg-gray-100`}>
                <td className="py-2 px-4 border-b">{row.location}</td>
                <td className="py-2 px-4 border-b">{row.shelve}</td>
                <td className="py-2 px-4 border-b">{row.bin_names}</td>
                <td className="py-2 px-4 border-b">{row.cm_part_id}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    href={row.product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-semibold underline"
                  >
                    {row.tat_sku}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{row.cm_part_description}</td>
                <td className="py-2 px-4 border-b">{row.qty}</td>
                <td className="py-2 px-4 border-b">{row.max_stock}</td>
                <td className="py-2 px-4 border-b">{row.unit}</td>
                <td className="py-2 px-4 border-b">
                  <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden mt-2">
                  <div
                    className="bg-green-500 h-full text-center text-white text-sm font-medium flex items-center justify-center transition-all"
                    style={{ width: `${process}%` }}
                  >
                    {process.toFixed(0)}%
                  </div>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">

                </td>
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
