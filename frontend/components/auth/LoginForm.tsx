'use client';

import Link from 'next/link';
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-semibold">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-black px-4 py-2 text-white"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
