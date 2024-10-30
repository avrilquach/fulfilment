// components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname(); // Lấy pathname hiện tại

  return (
    <aside className="bg-gray-700 text-gray-200 w-[20%] h-screen p-5 shadow-lg">
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/items-management">
              <div className={`hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/items-management' ? 'bg-blue-600' : ''}`}>
                Items management
              </div>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/container-management">
              <div className={`hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/container-management' ? 'bg-blue-600' : ''}`}>
                Container management
              </div>
            </Link>
          </li>
          <li className="mb-4 hidden">
            <Link href="/bin-stock-management">
              <div className={`hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/bin-stock-management' ? 'bg-blue-600' : ''}`}>
                Bin stock management
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
