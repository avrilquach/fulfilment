"use client"; // Specify that this is a client component
import React, { useState } from 'react';
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";

const AddDataPage: React.FC = () => {
  const [locationName, setLocationName] = useState('');
  const [shelveName, setShelveName] = useState('');
  const [shelveLocationId, setShelveLocationId] = useState('');
  const [binName, setBinName] = useState('');
  const [binShelveId, setBinShelveId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await fetch('/api/container-management/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: locationName }),
      });
      if (!response.ok) throw new Error('Failed to add location');
      setMessage('Location added successfully');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleAddShelve = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await fetch('/api/container-management/shelve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: shelveName, location_id: shelveLocationId }),
      });
      if (!response.ok) throw new Error('Failed to add shelve');
      setMessage('Shelve added successfully');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleAddBin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await fetch('/api/container-management/bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: binName, shelve_id: binShelveId }),
      });
      if (!response.ok) throw new Error('Failed to add bin');
      setMessage('Bin added successfully');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%] space-y-6">
          <h2 className="text-xl font-semibold">Add Location, Shelve, and Bin</h2>
          {message && <p className="text-green-600">{message}</p>}

          {/* Add Location Form */}
          <form onSubmit={handleAddLocation} className="space-y-4 border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Add Location</h3>
            <div>
              <label className="block font-semibold mb-1">Location Name</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter location name"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Add Location
            </button>
          </form>

          {/* Add Shelve Form */}
          <form onSubmit={handleAddShelve} className="space-y-4 border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Add Shelve</h3>
            <div>
              <label className="block font-semibold mb-1">Shelve Name</label>
              <input
                type="text"
                value={shelveName}
                onChange={(e) => setShelveName(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter shelve name"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Location ID</label>
              <input
                type="text"
                value={shelveLocationId}
                onChange={(e) => setShelveLocationId(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter location ID"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Add Shelve
            </button>
          </form>

          {/* Add Bin Form */}
          <form onSubmit={handleAddBin} className="space-y-4 border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Add Bin</h3>
            <div>
              <label className="block font-semibold mb-1">Bin Name</label>
              <input
                type="text"
                value={binName}
                onChange={(e) => setBinName(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter bin name"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Shelve ID</label>
              <input
                type="text"
                value={binShelveId}
                onChange={(e) => setBinShelveId(e.target.value)}
                className="border p-2 w-full"
                placeholder="Enter shelve ID"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Add Bin
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AddDataPage;
