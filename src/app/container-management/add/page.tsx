"use client"; // Specify that this is a client component
import React, { useEffect, useState } from 'react';
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";
import { useRouter } from 'next/navigation';
import Select from "react-select";

interface Option {
  value: number; // Change to string if your IDs are strings
  label: string;
}

const AddDataPage: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [locationList, setLocationList] = useState<Option[]>([]);

  const [selectedShelve, setSelectedShelve] = useState<Option | null>(null);
  const [shelveList, setShelveList] = useState<Option[]>([]);

  const [selectedBin, setSelectedBin] = useState<Option | null>(null);
  const [binList, setBinList] = useState<Option[]>([]);

  const getDataLocation = async () => {
    try {
      const response = await fetch('/api/container-management/location/getAll');
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

  useEffect(() => {
    getDataLocation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare the body for submission
    const body = {
      location: selectedLocation?.value, // Use the value from the selected location
      shelve: selectedShelve?.value,     // Use the value from the selected shelve
      bin: selectedBin?.value,           // Use the value from the selected bin
    };

    try {
      const response = await fetch('/api/container-management/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log("response",response);
      if (!response.ok) throw new Error('Failed to add data');

      // Redirect to container management page after successful addition
      router.push('/container-management');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (selectedOption: Option | null) => {
    setSelectedLocation(selectedOption);
    setSelectedShelve(null);
    setShelveList([]);
    setSelectedBin(null);
    setBinList([]);

    if (selectedOption) {
      try {
        const response = await fetch(`/api/container-management/shelves?zoneId=${selectedOption.value}`);
        const data = await response.json();
        setShelveList(data.rows.map((shelve: { id: number; name: string }) => ({
          value: shelve.id,
          label: shelve.name,
        })));
      } catch (error) {
        console.error('Error fetching shelves:', error);
      }
    }
  };

  const handleShelveChange = async (selectedOption: Option | null) => {
    setSelectedShelve(selectedOption);
    setSelectedBin(null);
    setBinList([]);

    if (selectedOption) {
      try {
        const response = await fetch(`/api/container-management/bin?shelveId=${selectedOption.value}`);
        const data = await response.json();
        setBinList(data.rows.map((bin: { id: number; name: string }) => ({
          value: bin.id,
          label: bin.name,
        })));
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    }
  };

  const handleBinChange = (selectedOption: Option | null) => {
    setSelectedBin(selectedOption);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <h2 className="text-xl font-semibold mb-4">Add Container Data</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Location</label>
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
              <label className="block font-semibold mb-1">Shelve</label>
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
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {loading ? 'Adding...' : 'Add Data'}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AddDataPage;
