"use client"; // This is a client component
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

interface User {
  company_name: string;
  // Add other properties if needed
}

const Header = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user) as User | null;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Successfully logged out');
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  const handleSettings = () => {
    router.push('/items-management');
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <header className="bg-[#232f3e] text-white p-4">
      <div className="flex justify-between items-center">
        {/* Left Side: Company Name and Tagline */}
        <div onClick={handleHome} className={"cursor-pointer"}>
          <h1 className="text-3xl font-bold">{user?.company_name || 'Company Name'}</h1>
          <h2 className="text-sm">C-part management - BU & Zone view</h2>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Settings Button */}
          <button
            onClick={handleSettings}
            className="bg-[#34a853] hover:bg-[#4bc769] text-white font-semibold py-2 px-4 rounded"
          >
            Settings
          </button>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="bg-[#d93025] hover:bg-[#ea4335] text-white font-semibold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
