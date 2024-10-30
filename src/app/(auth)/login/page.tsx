'use client';
import { useState } from 'react';
import { setUser } from '../../../features/user/userSlice';
import {useDispatch} from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Page() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const response = await fetch('/authenticate/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Giả sử response có trường user bao gồm company_name
      dispatch(setUser({
        id: data.user.id,
        email: data.user.email,
        company_name: data.user.company_name, // Lưu company_name vào Redux state
      }));
      router.push('/items-management');
    } else {
      alert(data.message);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to your account</h2>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              aria-label="Sign in"
              className="bg-[#faa51a] hover:bg-[#f8c75a] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
