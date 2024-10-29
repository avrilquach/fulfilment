"use client"; // Chỉ định rằng đây là một component client

import React, { useState, useEffect } from 'react';
// Nếu bạn sử dụng react-select
import Select from 'react-select';
interface Sku {
  sku_id: string;
  name: string;
  qty_per_container: number;
  unit: string;
  active: number;
  zone: string | null;
  bu: string | null;
}

const SkuRfidManager = ({ onSave }: { onSave: () => void }) => {
  const [selectedSku, setSelectedSku] = useState('');
  const [rfidList, setRfidList] = useState(''); // Chuyển đổi thành mảng
  const [skuList, setSkuList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [saving, setSaving] = useState(false); // Loading state for saving
  // State để lưu thông tin SKU đã chọn
  const [selectedSkuDetails, setSelectedSkuDetails] = useState<{
    value: string;
    name: string;
    qty_per_container: number;
    unit: string;
    active: number;
    bu: string | null;
  } | null>(null);

  // Fetch SKU list and Shelves list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch SKU List
        const skuResponse = await fetch('/api/sku', {
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
          value: sku.sku_id,
          label: sku.sku_id, // You might want to use sku.name here for better clarity
          name: sku.name,
          qty_per_container: sku.qty_per_container,
          unit: sku.unit,
          active: sku.active,
          bu: sku.bu,
        })));
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSkuChange = (selectedOption:any) => {
    setSelectedSku(selectedOption);
    const selectedSkuItem = skuList.find(sku => sku.value === selectedOption.value);
    if (selectedSkuItem) {
      setSelectedSkuDetails({
        value: selectedSkuItem.value,
        name: selectedSkuItem.name,
        qty_per_container: selectedSkuItem.qty_per_container,
        unit: selectedSkuItem.unit,
        active: selectedSkuItem.active,
        bu: selectedSkuItem.bu,
      });
    } else {
      setSelectedSkuDetails(null);
    }
  };

  const handleRfidChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRfidList(event.target.value);
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
    const selectedSkuQty = selectedSkuDetails ? selectedSkuDetails.qty_per_container : '';
    const selectedSkuUnit = selectedSkuDetails ? selectedSkuDetails.unit : '';
    const selectedSkuBu = selectedSkuDetails ? selectedSkuDetails.bu : '';

    setSaving(true); // Bắt đầu loading khi lưu

    // Lặp qua từng RFID
    for (const rfid of rfidArray) {
      try {
        const response = await fetch('/api/parts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cm_part_id: '',
            name: selectedSkuName, // Lưu thông tin SKU name
            qty_container: selectedSkuQty,
            unit: selectedSkuUnit,
            status: 'Empty', // Giả sử bạn có thông tin này từ state
            fill_date: '', // Ngày điền
            bu: selectedSkuBu, // Giả sử bạn có thông tin này từ state
            tat_sku: tat_sku,
            container_rfid: rfid, // Hoặc tên biến khác tùy theo yêu cầu
            created_at:  new Date().toISOString(),
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
    onSave();
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
        <div>
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
      </div>
      <div>
        <div className="flex items-end h-full">
          <button
            onClick={handleSave}
            disabled={saving} // Vô hiệu hóa nút khi đang lưu
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
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
