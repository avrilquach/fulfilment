// SelectedRow.tsx

import React, {useEffect, useState} from 'react';
import moment from 'moment';

interface SelectedRowProps {
  row: {
    cm_part_id: number;
    tat_sku: string;
    name: string;
    qty_container: number;
    unit: string;
    status: string;
    fill_date: string;
    bu: string;
    zone: string;
    shelve_id: string;
    bin: string;
    container_rfid: string;
  };
}

const SelectedRow: React.FC<SelectedRowProps> = ({ row }) => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>(row.zone); // Set initial selected zone
  const [shelves, setShelves] = useState<any[]>([]);
  const [selectedShelveId, setSelectedShelveId] = useState<string>(row.shelve_id);
  const [bins, setBins] = useState<{ id: number; name: string }[]>([]);
  const [selectedBinId, setSelectedBinId] = useState<string>(row.bin);
  const [containerRfid, setContainerRfid] = useState(row.container_rfid); // State for Container RFID
  const [partsRfid, setPartsRfid] = useState<string[]>([]); // State for Parts RFID as an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resZone = await fetch('/api/zone', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const dataZone = await resZone.json();
        setZones(dataZone.rows);
      } catch (err:any) {
        console.log(err.message);
      }
    };
    fetchData();
    const getpartsRfid= async () => {
      try {
        const reponse = await fetch('/api/parts/rfid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ containerRfid }),
        });
        const data = await reponse.json();
        setPartsRfid(data.rows);
      } catch (err:any) {
        console.log(err.message);
      }
    };
    getpartsRfid();
  }, [containerRfid]);

  // Function to handle zone selection
  const handleZoneChange = async (zoneId: string) => {
    setSelectedZone(zoneId); // Update the selected zone

    // Fetch shelves based on the selected zone
    try {
      const response = await fetch(`/api/shelves?zoneId=${zoneId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setShelves(data.rows); // Ensure that response.data is an array of shelves
    } catch (error) {
      console.error('Error fetching shelves:', error);
    }
  };

  const handleShelveChange = async (shelveId: string) => {
    setSelectedShelveId(shelveId); // Update the selected zone

    try {
      const response = await fetch(`/api/bin?shelveId=${shelveId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setBins(data.rows);
    } catch (error) {
      console.error('Error fetching bin:', error);
    }
  };

  const handleSave = async () => {
    // Check if containerRfid exists in partsRfid
    if (partsRfid.includes(containerRfid)) {
      console.error("Container RFID already exists in parts list.");
      alert("Container RFID already exists in parts list. Please enter a unique RFID.");
      return; // Exit the function to prevent saving
    }

    // Check required fields
    if (!selectedZone) {
      alert("Please select a zone.");
      return; // Exit if zone is not selected
    }

    if (!selectedShelveId) {
      alert("Please select a shelf.");
      return; // Exit if shelf is not selected
    }

    if (!selectedBinId) {
      alert("Please select a bin.");
      return; // Exit if bin is not selected
    }

    // Prepare data for the API call
    const dataToSave = {
      cm_part_id: row.cm_part_id,
      zone_id: selectedZone,
      shelve_id: selectedShelveId,
      bin_id: selectedBinId,
      container_rfid: containerRfid,
    };

    // Call the API to save data
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
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }

  };

  return (
    <div className="mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-4 border-b text-left">CM Part ID</th>
          <th className="py-2 px-4 border-b text-left">TAT SKU</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-left">Qty/Container</th>
          <th className="py-2 px-4 border-b text-left">Unit</th>
          <th className="py-2 px-4 border-b text-left">Status</th>
          <th className="py-2 px-4 border-b text-left">Fill Date</th>
          <th className="py-2 px-4 border-b text-left">BU</th>
          <th className="py-2 px-4 border-b text-left">Zone</th>
          <th className="py-2 px-4 border-b text-left">Shelve ID</th>
          <th className="py-2 px-4 border-b text-left">Bin</th>
          <th className="py-2 px-4 border-b text-left">Container RFID</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td className="py-2 px-4 border-b">{row.cm_part_id}</td>
          <td className="py-2 px-4 border-b">{row.tat_sku}</td>
          <td className="py-2 px-4 border-b">{row.name}</td>
          <td className="py-2 px-4 border-b">{row.qty_container}</td>
          <td className="py-2 px-4 border-b">{row.unit}</td>
          <td className="py-2 px-4 border-b">{row.status}</td>
          <td className="py-2 px-4 border-b">{moment(row.fill_date).format('DD/MM/YYYY')}</td>
          <td className="py-2 px-4 border-b">{row.bu}</td>
          <td className="py-2 px-4 border-b"><select
            id="zone-select"
            value={selectedZone}
            onChange={(e) => handleZoneChange(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="" disabled>Select a zone</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select></td>
          <td className="py-2 px-4 border-b">
            <select
              id="shelve-select"
              value={selectedShelveId}
              onChange={(e) => handleShelveChange(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="" disabled>Select a shelf</option>
              {shelves.map(shelve => (
                <option key={shelve.id} value={shelve.id}>
                  {shelve.id}
                </option>
              ))}
            </select></td>
          <td className="py-2 px-4 border-b">
            <select
              id="bin-select"
              value={selectedBinId}
              onChange={(e) => setSelectedBinId(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="" disabled>Select a bin</option>
              {bins.map(bin => (
                <option key={bin.id} value={bin.id}>
                  {bin.name}
                </option>
              ))}
            </select>
          </td>
          <td className="py-2 px-4 border-b">
            <input
              type="text"
              value={containerRfid} // Controlled input
              onChange={(e) => setContainerRfid(e.target.value)} // Update state on change
              className="border px-2 py-1 rounded w-full" // Styling for input
            />
          </td>
        </tr>
        <tr>
          <td colSpan={12} align={"right"}>
            {/* Save Button positioned at the top right */}
            <button
              onClick={handleSave}
              className="m-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
            >
              Save
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SelectedRow;
