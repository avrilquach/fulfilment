// pages/container-management/LocationPage.tsx
"use client"; // Đây là một component client-side

import React, { useState, useEffect } from 'react';
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";
import DataTable from "../../components/container-management/location/DataTable";
import Pagination from "../../components/pagination";

interface Location {
  id: number;
  name: string;
}

export default function LocationPage() {
  const [newLocationName, setNewLocationName] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null); // State cho địa điểm đang chỉnh sửa
  const [modalVisible, setModalVisible] = useState(false); // State để kiểm soát hiển thị modal
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);

  // Hàm để lấy danh sách địa điểm
  const fetchLocations = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/container-management/location?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const result = await response.json();
      setLocations(result.data);
      setTotalCount(result.total[0].count);
    } catch (error:any) {
      console.error('Error fetching locations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Lấy danh sách địa điểm khi component được mount hoặc khi currentPage thay đổi
  useEffect(() => {
    fetchLocations(currentPage);
  }, [currentPage]);
  // Thêm một địa điểm mới
  const handleAddLocation = async () => {
    if (!newLocationName) {
      alert("Location name is required!");
      return;
    }

    try {
      const response = await fetch('/api/container-management/location/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newLocationName }), // Giả sử bạn chỉ cần tên địa điểm
      });

      const data = await response.json();

      if (response.ok) {
        // Nếu thành công, cập nhật danh sách địa điểm
        setLocations((prev) => [...prev, { id: data.id, name: newLocationName }]);
        setNewLocationName(''); // Reset input
        alert('Location added successfully!');
      } else {
        // Nếu không thành công, hiển thị thông báo lỗi
        alert(data.message || 'Failed to add location');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Server error. Please try again later.');
    }
  };
  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  // Hàm để chỉnh sửa một địa điểm
  const handleEdit = (id: number) => {
    const locationToEdit = locations.find(location => location.id === id);
    if (locationToEdit) {
      setEditingLocation(locationToEdit);
      setModalVisible(true); // Mở modal chỉnh sửa
    }
  };

  // Hàm để xóa một địa điểm
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this location?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/location/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }

      const result = await response.json();
      alert(result.message);
      fetchLocations(currentPage); // Refresh the locations list
    } catch (error:any) {
      console.error('Error deleting location:', error);
      alert('Error deleting location: ' + error.message);
    }
  };
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="p-4 w-[80%]">
          <h1 className="text-2xl font-semibold mb-4">Location Management</h1>

          {/* Form thêm địa điểm */}
          <div className="mb-6">
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Enter new location name"
              className="border px-4 py-2 mr-4"
            />
            <button
              onClick={handleAddLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add Location
            </button>
          </div>
          {/* Hiển thị danh sách địa điểm */}
          <DataTable data={locations} onEdit={handleEdit} onDelete={handleDelete} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </>
  );
}
