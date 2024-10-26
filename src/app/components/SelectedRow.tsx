// SelectedRow.tsx
import React, {useEffect, useState} from 'react';
import moment from 'moment';

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

const SelectedRow: React.FC<SelectedRowProps> = ({ row }) => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>(); // Set initial selected zone
  const [shelves, setShelves] = useState<any[]>([]);
  const [selectedShelveId, setSelectedShelveId] = useState<string>();
  const [bins, setBins] = useState<{ id: number; name: string }[]>([]);
  const [selectedBinId, setSelectedBinId] = useState<string>();
  const [containerRfid, setContainerRfid] = useState(row.container_rfid); // State for Container RFID
  const [partsRfid, setPartsRfid] = useState<string[]>([]); // State for Parts RFID as an array
  const [selectedPartId, setSelectedPartId] = useState<string>(row.cm_part_id);

  useEffect(() => {
    /*const getDataZone = async () => {
      try {
        const resZone = await fetch('/api/zone', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const dataZone = await resZone.json();
        //setZones(dataZone.rows);
      } catch (err:any) {
        console.log(err.message);
      }
    };
    getDataZone();
    const getDataShelve = async () => {
       // Fetch shelves based on the selected zone
       try {
         const response = await fetch(`/api/shelves?zoneId=${selectedZone}`, {
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
     getDataShelve();
     const getDataBin = async () => {
       try {
         const response = await fetch(`/api/bin?shelveId=${selectedShelveId}`, {
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
     getDataBin();*/
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

    /*// Check required fields
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
    }*/

    // Prepare data for the API call
    const dataToSave = {
      id: row.id,
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
        window.location.href = window.location.href;
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }

  };

  return (
    <div className="overflow-x-auto">
      <div key={row.cm_part_id} className="border border-gray-200 mb-4">
        <div className="bg-gray-200 font-bold py-2 px-4">Edit Form: {row.id}</div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">CM Part ID:</label>
                <span>{row.cm_part_id}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">TAT SKU:</label>
                <span>{row.tat_sku}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Name:</label>
                <span>{row.name}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Qty/Container:</label>
                <span>{row.qty_container}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Unit:</label>
                <span>{row.unit}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Status:</label>
                <span>{row.status}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Fill Date:</label>
                <span>{moment(row.fill_date).format('DD/MM/YYYY')}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">BU:</label>
                <span>{row.bu}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Zone:</label>
                <span>{row.zone_name}</span>
              </div>
              {/*<select
                id="zone-select"
                value={selectedZone}
                onChange={(e) => handleZoneChange(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="" disabled>Select a zone</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>*/}
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Shelve ID:</label>
                <span>{row.shelve_id}</span>
              </div>
              {/*<select
                id="shelve-select"
                value={selectedShelveId}
                onChange={(e) => handleShelveChange(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="" disabled>Select a shelf</option>
                {shelves.map(shelve => (
                  <option key={shelve.id} value={shelve.id}>
                    {shelve.id}
                  </option>
                ))}
              </select>*/}
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block font-bold">Bin:</label>
                <span>{row.bin_name}</span>
              </div>
              {/*<select
                id="bin-select"
                value={selectedBinId}
                onChange={(e) => setSelectedBinId(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="" disabled>Select a bin</option>
                {bins.map(bin => (
                  <option key={bin.id} value={bin.id}>
                    {bin.name}
                  </option>
                ))}
              </select>*/}
            </div>
            <div>
              <label className="block font-bold">Container RFID:</label>
              <input
                type="text"
                value={containerRfid}
                onChange={(e) => setContainerRfid(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
          </div>
        </div>
        <div className={"flex justify-end"}>
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
