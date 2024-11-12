'use client';
import React from 'react';
import moment from 'moment';

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
              <td
                className={`py-2 px-4 border-b ${row.status === 'Empty' ? 'bg-yellow-300' : ''}`}
              >
                {row.sku}
              </td>
              <td
                className={`py-2 px-4 border-b ${row.status === 'Empty' ? 'bg-yellow-300' : ''}`}
              >
                {row.rfid}
              </td>
              <td
                className={`py-2 px-4 border-b ${row.status === 'Empty' ? 'bg-yellow-300' : ''}`}
              >
                {row.qty}
              </td>
              <td
                className={`py-2 px-4 border-b ${row.status === 'Empty' ? 'bg-yellow-300' : ''}`}
              >
                {row.status}
              </td>
              <td
                className={`py-2 px-4 border-b ${row.status === 'Empty' ? 'bg-yellow-300' : ''}`}
              >
                {moment(row.time).format('DD/MM/YYYY HH:mm:ss')}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="py-2 px-4 border-b text-center">
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
