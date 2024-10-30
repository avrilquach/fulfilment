import { useState, useEffect } from 'react';
import Select from "react-select";

interface RfidData {
  location: string;
  shelve: string;
  bin: string;
  container_id: string;
  status: 'Inactive' | 'Empty' | 'Full';
}

interface AddRfidDataProps {
  onAddSuccess: () => void;
  initialData?: RfidData | null;
}

interface Option {
  value: number;
  label: string;
}

interface Shelve {
  id: number;
  name: string;
}

interface Bin {
  id: number;
  name: string;
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

  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [locationList, setLocationList] = useState<Option[]>([]);

  const [selectedShelve, setSelectedShelve] = useState<Option | null>(null);
  const [shelveList, setShelveList] = useState<Option[]>([]);

  const [selectedBin, setSelectedBin] = useState<Option | null>(null);
  const [binList, setBinList] = useState<Option[]>([]);

  const getDataLocation = async () => {
    try {
      const response = await fetch('/api/container-management/location');
      const data = await response.json();
      const locations = data.rows.map((location: { id: number; name: string }) => ({
        value: location.id,
        label: location.name,
      }));
      setLocationList(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationChange = async (selectedOption: Option | null) => {
    setSelectedLocation(selectedOption);
    setSelectedShelve(null);
    setShelveList([]);
    setSelectedBin(null);
    setBinList([]);

    if (!selectedOption) {
      setFormData((prev) => ({ ...prev, location: '', shelve: '', bin: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, location: selectedOption.value.toString() }));

    try {
      const response = await fetch(`/api/container-management/shelves?zoneId=${selectedOption.value}`);
      const data = await response.json();
      setShelveList(data.rows.map((shelve: Shelve) => ({
        value: shelve.id,
        label: shelve.name,
      })));
    } catch (error) {
      console.error('Error fetching shelves:', error);
    }
  };

  const handleShelveChange = async (selectedOption: Option | null) => {
    setSelectedShelve(selectedOption);
    setSelectedBin(null);
    setBinList([]);

    if (!selectedOption) {
      setFormData((prev) => ({ ...prev, shelve: '', bin: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, shelve: selectedOption.value.toString() }));

    try {
      const response = await fetch(`/api/container-management/bin?shelveId=${selectedOption.value}`);
      const data = await response.json();
      setBinList(data.rows.map((bin: Bin) => ({
        value: bin.id,
        label: bin.name,
      })));
    } catch (error) {
      console.error('Error fetching bins:', error);
    }
  };

  const handleBinChange = (selectedOption: Option | null) => {
    setSelectedBin(selectedOption);
    setFormData((prev) => ({ ...prev, bin: selectedOption ? selectedOption.value.toString() : '' }));
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const initialLocation = locationList.find((loc) => loc.value.toString() === initialData.location);
      const initialShelve = shelveList.find((shelve) => shelve.value.toString() === initialData.shelve);
      const initialBin = binList.find((bin) => bin.value.toString() === initialData.bin);

      setSelectedLocation(initialLocation || null);
      setSelectedShelve(initialShelve || null);
      setSelectedBin(initialBin || null);
    } else {
      setFormData({
        location: '',
        shelve: '',
        bin: '',
        container_id: '',
        status: 'Inactive',
      });
    }
    getDataLocation();
  }, [initialData,binList,locationList,shelveList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = initialData ? '/api/container-management/edit' : '/api/container-management/add';
    const method = initialData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
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
          <Select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            options={locationList}
            isClearable
            placeholder="Select a location"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="shelve" className="block font-semibold mb-1">Shelve</label>
          <Select
            id="shelve"
            value={selectedShelve}
            onChange={handleShelveChange}
            options={shelveList}
            isClearable
            placeholder="Select a shelve"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="bin" className="block font-semibold mb-1">Bin</label>
          <Select
            id="bin"
            value={selectedBin}
            onChange={handleBinChange}
            options={binList}
            isClearable
            placeholder="Select a bin"
            className="w-full"
          />
        </div>
        {initialData && (
          <>
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
                className="w-full p-2 border rounded"
              >
                <option value="Inactive">Inactive</option>
                <option value="Empty">Empty</option>
                <option value="Full">Full</option>
              </select>
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {initialData ? 'Update Data' : 'Add Data'}
        </button>
      </form>
    </div>
  );
};

export default AddRfidData;
