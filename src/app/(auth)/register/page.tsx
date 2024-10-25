"use client"
import { useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repassword: '',
    company_name: '', // Add company_name to the state
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { email, password, repassword, company_name } = formData;

    if (password !== repassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, company_name }), // Include company_name in the request
      });

      const data = await res.json();
      if (res.status === 201) {
        setSuccess(data.message);
        setError('');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="mb-4">
            <label htmlFor="company_name" className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Company Name"
              required
            />
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="repassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              id="repassword"
              name="repassword"
              value={formData.repassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-[#faa51a] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f8c75a]'} text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-4">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign In</a></p>
      </div>
    </div>
  );
}
