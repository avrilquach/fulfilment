// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const pages: number[] = [];

  // Hiển thị các nút phân trang
  if (totalPages <= 5) {
    // Nếu tổng số trang <= 5, hiển thị tất cả
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Nếu tổng số trang > 5
    pages.push(1); // Luôn hiển thị trang đầu tiên

    // Hiển thị các số trang xung quanh currentPage
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    pages.push(totalPages); // Luôn hiển thị trang cuối cùng
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex items-center space-x-2">
          {/* Nút "First" */}
          <li>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
            >
              First
            </button>
          </li>
          {/* Nút "Previous" */}
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
            >
              Previous
            </button>
          </li>
          {/* Nút số trang */}
          {pages.map((page) => (
            <li key={page}>
              <button
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {page}
              </button>
            </li>
          ))}
          {/* Nút "Next" */}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
            >
              Next
            </button>
          </li>
          {/* Nút "Last" */}
          <li>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
