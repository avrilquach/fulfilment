// SelectedRow.tsx
'use client';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import _ from 'lodash';
import Select from "react-select";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';

interface SelectedRowProps {
  row: {
    id: number;
    cm_part_id: string;
    tat_sku: string;
    name: string;
    qty_container: number;
    unit: string;
    status: string;
    fill_date: string;
    bu: string;
    zone_id: string;
    zone_name:string;
    shelve_id: string;
    bin_id: string;
    bin_name:string;
    container_rfid: string;
  };
}

interface Zone {
  id: number;
  name: string;
}

interface Shelve {
  id: number;
  name: string;
}

interface Bin {
  id: number;
  name: string;
}

interface Option {
  value: string;
  label: string;
}

const options: Option[] = [
  { value: "Empty", label: 'Empty' },
  { value: "Full", label: 'Full' },
];

const SelectedRow: React.FC<SelectedRowProps> = ({ row }) => {
  const router = useRouter();
  const [cmPartId, setCmPartId] = useState(row.cm_part_id);
  const [containerRfid, setContainerRfid] = useState(row.container_rfid); // State for Container RFID
  const [partsRfid, setPartsRfid] = useState<string[]>([]); // State for Parts RFID as an array
  const [firstRfid, setFirstRfid] = useState(row.container_rfid);

  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [zoneList, setZoneList] = useState([]);

  const [selectedShelve, setSelectedShelve] = useState<Option | null>(null);
  const [shelveList, setShelveList] = useState([]);

  const [selectedBin, setSelectedBin] = useState<Option | null>(null);
  const [binList, setBinList] = useState([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>();


  useEffect(() => {
    const getDataZone = async () => {
      try {
        const response = await fetch('/api/zone', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setZoneList(data.rows.map((zone: Zone) => ({
          value: zone.id,
          label: zone.name,
        })));
      } catch (err: any) {
        console.log(err.message);
      }
    };
    getDataZone();

    const getpartsRfid= async () => {
      try {
        const reponse = await fetch('/api/parts/rfid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstRfid }),
        });
        const data = await reponse.json();
        setPartsRfid(data.rows);
      } catch (err:any) {
        console.log(err.message);
      }
    };
    getpartsRfid();
  }, [containerRfid,firstRfid]);

  const handleZoneChange = async (selectedOption:any) => {
    setSelectedZone(selectedOption);
    setSelectedShelve(null);
    if (!selectedOption) return; // Kiểm tra nếu không có zone được chọn

    try {
      const response = await fetch(`/api/shelves?zoneId=${selectedOption.value}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setShelveList(data.rows.map((shelve: Shelve) => ({
        value: shelve.id,
        label: shelve.name,
      })));
    } catch (error) {
      console.error('Error fetching shelves:', error);
    }
  };

  const handleShelveChange = async (selectedOption:any) => {
    setSelectedShelve(selectedOption);
    try {
      const response = await fetch(`/api/bin?shelveId=${selectedOption.value}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setBinList(data.rows.map((bin: Bin) => ({
        value: bin.id,
        label: bin.name,
      })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleBinChange = (selectedOption:any) => {
    setSelectedBin(selectedOption);
  };

  const handleSave = async () => {
    const isContainerRfidExists = partsRfid.includes(containerRfid);
    if (isContainerRfidExists) {
      alert("Container RFID already exists in parts list. Please enter a unique RFID.");
      return;
    }

    // Prepare data for the API call
    const dataToSave: any = {
      id: row.id,
      container_rfid: containerRfid,
    };

    // Conditionally include properties if they have values
    if (cmPartId) {
      dataToSave.cm_part_id = cmPartId; // Only set if cmPartId has a value
    }

    if (selectedOption) {
      dataToSave.status = selectedOption.value; // Assuming selectedOption is the object returned from react-select
    }

    if (selectedDate) {
      dataToSave.fill_date = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss'); // Using moment.js
    }

    if (selectedZone) {
      dataToSave.zone_id = selectedZone.value; // Only set if a zone is selected
    }

    if (selectedShelve) {
      dataToSave.shelve_id = selectedShelve.value; // Only set if a shelve is selected
    }

    if (selectedBin) {
      dataToSave.bin_id = selectedBin.value; // Only set if a bin is selected
    }

    try {
      const response = await fetch('/api/parts/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.href = '/rfid-management';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
  };

  return (
    <div className="relative z-50">
      <div className="border border-gray-200 mb-4">
        <div className="bg-gray-200 font-bold py-2 px-4">Edit Form: {row.id}</div>
        <div className="p-4">
          <table className="min-w-full border-collapse">
            <thead>
            <tr>
              <th className="border px-4 py-2">CM Part ID</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Fill Date</th>
              <th className="border px-4 py-2">Zone</th>
              <th className="border px-4 py-2">Shelve</th>
              <th className="border px-4 py-2">Bin</th>
              <th className="border px-4 py-2">Container RFID</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={cmPartId}
                  onChange={(e) => setCmPartId(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                /></td>
              <td className="border px-4 py-2">
                <Select
                  id="statusList"
                  value={selectedOption}
                  onChange={handleChange}
                  options={options}
                  placeholder="Select Status"
                /></td>
              <td className="border px-4 py-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="border px-2 py-1 rounded"
                />
              </td>
              <td className="border px-4 py-2">
                {Number(row.zone_id) == 0 ? <Select
                  id="zoneList"
                  value={selectedZone}
                  onChange={handleZoneChange}
                  options={zoneList}
                  placeholder="Select Zone"
                /> : row.zone_name}
              </td>
              <td className="border px-4 py-2">
                {Number(row.shelve_id) == 0 ?  <Select
                  id="shelveList"
                  value={selectedShelve}
                  onChange={handleShelveChange}
                  options={shelveList}
                  placeholder="Select Shelve"
                /> : row.shelve_id}
              </td>
              <td className="border px-4 py-2">
                {Number(row.bin_id) == 0 ? <Select
                  id="binList"
                  value={selectedBin}
                  onChange={handleBinChange}
                  options={binList}
                  placeholder="Select Bin"
                /> : row.bin_name}
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={containerRfid}
                  onChange={(e) => setContainerRfid(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="m-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedRow;
