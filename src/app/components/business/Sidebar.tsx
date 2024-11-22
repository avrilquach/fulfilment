import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [locationList, setLocationList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getDataLocation = async () => {
    try {
      const response = await fetch('/api/container-management/location/getAll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocationList(data.rows);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataLocation();
  }, []);

  return (
    <aside className="bg-gray-700 text-gray-200 w-[20%] h-screen p-5 shadow-lg">
      <Link href="/">
        <h2 className={`mb-4 hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/' ? 'bg-blue-600' : ''}`}>
          WTC
        </h2>
      </Link>
      <nav className="ml-4">
        <ul>
          {/* Loading State */}
          {loading && (
            <li className="text-gray-400 mt-4">Loading locations...</li>
          )}
          {/* Error State */}
          {error && (
            <li className="text-red-400 mt-4">{error}</li>
          )}
          {/* Dynamic Location Links */}
          {locationList.length > 0 && !loading && !error ? (
            locationList.map((location) => (
              <li key={location.id} className="mb-4">
                <Link href={`/business/${location.id}`}>
                  <div
                    className={`hover:bg-gray-600 p-2 rounded transition duration-200 ${
                      pathname === `/business/${location.id}` ? 'bg-blue-600' : ''
                    }`}
                  >
                    {location.name}
                  </div>
                </Link>
              </li>
            ))
          ) : !loading && (
            <li className="text-gray-400 mt-4">No locations available</li>
          )}
        </ul>
      </nav>
      <Link href="/spend-tracker">
        <h2 className={`mb-4 hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/spend-tracker' ? 'bg-blue-600' : ''}`}>
          Spend Tracker
        </h2>
      </Link>
    </aside>
  );
};

export default Sidebar;
