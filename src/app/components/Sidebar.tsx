// components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname(); // Lấy pathname hiện tại

  return (
    <aside className="bg-gray-700 text-gray-200 w-64 h-screen p-5 shadow-lg">
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/rfid-management">
              <div className={`hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/rfid-management' ? 'bg-blue-600' : ''}`}>
                RFID management
              </div>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/sku-rfid-management">
              <div className={`hover:bg-gray-600 p-2 rounded transition duration-200 ${pathname === '/sku-rfid-management' ? 'bg-blue-600' : ''}`}>
                SKU & RFID management
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
