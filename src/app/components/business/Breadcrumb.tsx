import React, { useEffect, useState } from 'react';
import {useParams} from "next/navigation";

interface Item {
  id: number;
  name: number;
}

interface BreadcrumbProps {
  location_id: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ location_id  }) => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await fetch(`/api/breadcrumb/location?zoneId=${location_id}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        setData(result.rows);
      } catch (error: any) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Ensure loading state is turned off
      }
    };

    fetchItems();
  }, [location_id]); // Include itemsPerPage in dependencies

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  return (
    <div className="flex items-center text-gray-700 font-medium text-lg mb-4">
      <span>TAT</span>
      <span className="text-gray-400 mx-2">/</span>
      <span>{data[0].name}</span>
    </div>
  );
};

export default Breadcrumb;
