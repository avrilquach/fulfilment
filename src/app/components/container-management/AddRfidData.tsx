// AddRfidData.tsx
'use client';
import { useState, useEffect } from 'react';

interface RfidData {
  location: string;
  shelve: string;
  bin: string;
  container_id: string;
  status: 'Inactive' | 'Empty' | 'Full';
}

interface AddRfidDataProps {
  onAddSuccess: () => void;
  initialData?: RfidData | null; // New optional prop for editing
}

const AddRfidData: React.FC<AddRfidDataProps> = ({ onAddSuccess, initialData }) => {
  const [formData, setFormData] = useState<RfidData>({
    location: '',
    shelve: '',
    bin: '',
    container_id: '',
    status: 'Inactive',
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Effect to populate form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        location: '',
        shelve: '',
        bin: '',
        container_id: '',
        status: 'Inactive',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData", formData);
    const url = initialData ? `/api/container-management/edit` : '/api/container-management/add';
    const method = initialData ? 'PUT' : 'POST'; // Use PUT for editing

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage(result.message);
      if (response.ok) {
        setFormData({
          location: '',
          shelve: '',
          bin: '',
          container_id: '',
          status: 'Inactive',
        });
        setError(null);
        onAddSuccess();
      } else {
        setError(result.message || 'Failed to add/edit data');
      }
    } catch (error) {
      console.error('Failed to add/edit data:', error);
      setError('Failed to add/edit data');
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg max-w-md mb-6">
      <h2 className="text-lg font-bold mb-4">{initialData ? 'Edit' : 'Add'} Container Management Data</h2>
      {message && <p className="text-sm text-green-500 mb-2">{message}</p>}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="shelve" className="block font-semibold mb-1">Shelve</label>
          <input
            type="text"
            id="shelve"
            name="shelve"
            value={formData.shelve}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="bin" className="block font-semibold mb-1">Bin</label>
          <input
            type="text"
            id="bin"
            name="bin"
            value={formData.bin}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="container_id" className="block font-semibold mb-1">Container ID</label>
          <input
            type="text"
            id="container_id"
            name="container_id"
            value={formData.container_id}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block font-semibold mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          >
            <option value="Inactive">Inactive</option>
            <option value="Empty">Empty</option>
            <option value="Full">Full</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {initialData ? 'Update Data' : 'Add Data'}
        </button>
      </form>
    </div>
  );
};

export default AddRfidData;
