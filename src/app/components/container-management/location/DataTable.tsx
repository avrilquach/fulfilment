import React from 'react';

interface Location {
  id: number;
  name: string;
}

interface DataTableProps {
  data: Location[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-left">Index</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Actions</th>
        </tr>
        </thead>
        <tbody>
        {data.map((location, index) => (
          <tr key={location.id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">{index + 1}</td>
            <td className="py-2 px-4 border-b">{location.name}</td>
            <td className="py-2 px-4 border-b">
              <button
                onClick={() => onEdit(location.id)}
                className="hidden bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(location.id)}
                className="hidden bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
