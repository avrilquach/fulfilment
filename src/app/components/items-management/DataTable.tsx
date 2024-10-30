// DataTable.tsx
'use client';
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Link from 'next/link';

interface TableRow {
  id: number;
  cm_part_id: string;
  cm_part_description: string;
  unit: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  supplier_sku: string;
}

interface DataTableProps {
  data: TableRow[];
}

const DataTable: React.FC<DataTableProps> = ({  data }) => {

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">Index</th>
          <th className="py-2 px-4 border-b text-left">CM Part Id</th>
          <th className="py-2 px-4 border-b text-left">CM Part Description</th>
          <th className="py-2 px-4 border-b text-left">Unit</th>
          <th className="py-2 px-4 border-b text-left">Stock</th>
          <th className="py-2 px-4 border-b text-left">Min Stock</th>
          <th className="py-2 px-4 border-b text-left">Max Stock</th>
          <th className="py-2 px-4 border-b text-left">Supplier SKU</th>
        </tr>
        </thead>
        <tbody>
        {data.length > 0 ? (
          data.map((row,index) => (
            <tr key={index} className={`bg-gray-100`}>
              <td className="py-2 px-4 border-b">{row.id}</td>
              <td className="py-2 px-4 border-b">{row.cm_part_id}</td>
              <td className="py-2 px-4 border-b">{row.cm_part_description}</td>
              <td className="py-2 px-4 border-b">{row.unit}</td>
              <td className="py-2 px-4 border-b">{row.stock}</td>
              <td className="py-2 px-4 border-b">{row.min_stock}</td>
              <td className="py-2 px-4 border-b">{row.max_stock}</td>
              <td className="py-2 px-4 border-b">{row.supplier_sku}</td>
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
