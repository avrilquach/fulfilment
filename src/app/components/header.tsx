"use client"; // This is a client component
import { useSelector } from 'react-redux';

const Header = () => {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state:any) => state.user); // Lấy trạng thái người dùng từ Redux
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Handle successful logout, e.g., redirecting to the login page or showing a message
        console.log('Successfully logged out');
        // Optionally, redirect:
        window.location.href = '/login';
      } else {
        // Handle error response
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <header className="bg-[#232f3e] text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">{user.company_name}</h1>
          <h2 className="text-sm text-white">C-part management - BU & Zone view</h2>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleLogout}
            className="bg-[#faa51a] hover:bg-[#f8c75a] text-white font-semibold py-2 px-4 rounded mb-2"
          >
            Account logged
          </button>
          <button className="hidden bg-[#faa51a] hover:bg-[#f8c75a]  text-white font-semibold py-2 px-4 rounded">
            Purchase Order
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
