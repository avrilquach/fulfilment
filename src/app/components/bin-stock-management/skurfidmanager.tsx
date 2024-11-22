"use client"; // Chỉ định rằng đây là một component client

import React, { useState, useEffect } from 'react';
// Nếu bạn sử dụng react-select
import Select from 'react-select';
import { useRouter } from "next/navigation";

interface Sku {
  supplier_sku: string;
  cm_part_description: string;
}

interface SkuRfidManagerProps {
  onSaveComplete: () => void;
}

const SkuRfidManager: React.FC<SkuRfidManagerProps> = ({ onSaveComplete }) => {
  const router = useRouter();
  const [selectedSku, setSelectedSku] = useState('');
  const [rfidList, setRfidList] = useState(''); // Chuyển đổi thành mảng
  const [skuList, setSkuList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [saving, setSaving] = useState(false); // Loading state for saving
  const [qtyPerContainer, setQtyPerContainer] = useState<number>(1); // New state for qty_per_container
  const [selectedSkuDetails, setSelectedSkuDetails] = useState<{
    value: string;
    name: string;
  } | null>(null);

  // Fetch SKU list and Shelves list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch SKU List
        const skuResponse = await fetch('/api/items-management/getAll', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!skuResponse.ok) {
          throw new Error('Failed to fetch SKU list');
        }
        const skuData = await skuResponse.json();

        // Explicitly typing the sku in the map function
        setSkuList(skuData.rows.map((sku: Sku) => ({
          value: sku.supplier_sku,
          label: sku.supplier_sku, // You might want to use sku.name here for better clarity
          name: sku.cm_part_description,
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSkuChange = (selectedOption: any) => {
    setSelectedSku(selectedOption);
    const selectedSkuItem = skuList.find(sku => sku.value === selectedOption.value);
    if (selectedSkuItem) {
      setSelectedSkuDetails({
        value: selectedSkuItem.value,
        name: selectedSkuItem.name,
      });
    } else {
      setSelectedSkuDetails(null);
    }
  };

  const handleRfidChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRfidList(event.target.value);
  };

  const handleQtyPerContainerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Ensure the value is a valid number and set the state
    if (value && !isNaN(Number(value))) {
      setQtyPerContainer(Number(value));
    }
  };

  const handleSave = async () => {
    // Kiểm tra xem SKU đã được chọn hay chưa
    if (!selectedSku) {
      alert('SKU Code is required!');
      return;
    }

    // Chia tách danh sách RFID thành mảng
    const rfidArray = rfidList.split('\n').map(rfid => rfid.trim()).filter(rfid => rfid); // Xóa khoảng trắng và loại bỏ phần tử rỗng

    // Kiểm tra nếu không có RFID nào
    if (rfidArray.length === 0) {
      alert('RFID list cannot be empty!');
      return;
    }

    if (rfidArray.length > 10) {
      alert('You can only enter a maximum of 10 RFID codes!');
      return;
    }

    const tat_sku = selectedSkuDetails ? selectedSkuDetails.value : '';
    const selectedSkuName = selectedSkuDetails ? selectedSkuDetails.name : '';

    setSaving(true); // Bắt đầu loading khi lưu

    // Lặp qua từng RFID
    for (const rfid of rfidArray) {
      try {
        const response = await fetch('/api/bin-stock-management/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tat_sku: tat_sku,
            container_rfid: rfid, // Hoặc tên biến khác tùy theo yêu cầu
            qty_per_container: qtyPerContainer, // Include qty_per_container in the request
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message);
        } else {
          const data = await response.json();
          console.log('Saved Part:', data);
        }
      } catch (error) {
        console.error('Error saving part:', error);
      }
    }
    setSaving(false); // Kết thúc loading sau khi hoàn tất vòng lặp
    // Call the parent callback to refresh the data
    setRfidList('');
    onSaveComplete();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative z-10 grid bg-white shadow-lg rounded-lg gap-4 p-4 grid-cols-3 mb-6">
      {/* Select box cho mã SKU */}
      <div>
        <div className="mb-6">
          <label htmlFor="skuList" className="block text-sm font-medium text-gray-700 mb-2">
            Select SKU Code
          </label>
          <Select
            id="skuList"
            value={selectedSku}
            onChange={handleSkuChange}
            options={skuList}
            placeholder="Select SKU Code"
          />
        </div>
        <div className="mb-6">
          {/* Label và Input cho tên sản phẩm */}
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            value={selectedSkuDetails?.name || ''} // Gán tên sản phẩm từ selectedSkuDetails
            readOnly
            className="block w-full border border-gray-300 rounded-md p-3 bg-gray-100"
          />
        </div>
        {/* Input cho qty_per_container */}
        <div>
          <label htmlFor="qtyPerContainer" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity per Container
          </label>
          <input
            id="qtyPerContainer"
            type="number"
            value={qtyPerContainer}
            onChange={handleQtyPerContainerChange}
            min="1"
            className="block w-full border border-gray-300 rounded-md p-3"
          />
        </div>
      </div>
      {/* Textarea cho mã RFID */}
      <div>
        <label htmlFor="rfidList" className="block text-sm font-medium text-gray-700 mb-2">
          The RFID Code List can only contain a maximum of 10 RFID codes.
        </label>
        <textarea
          id="rfidList"
          rows={6}
          placeholder="Nhập danh sách mã RFID (mỗi mã trên một dòng)"
          value={rfidList}
          onChange={handleRfidChange}
          className="block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        ></textarea>
        <button
          onClick={handleSave}
          disabled={saving} // Vô hiệu hóa nút khi đang lưu
          className={`mt-6 inline-block bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 transition duration-200 ease-in-out ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Add New Data'}
        </button>
      </div>
      {saving && (
        <div className="flex justify-center mt-4">
          <div className="loader"></div> {/* Thêm spinner vào đây */}
        </div>
      )}
    </div>
  );
};

export default SkuRfidManager;
