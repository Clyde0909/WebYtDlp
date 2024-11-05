"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState<string | undefined>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  async function handleLogin(password: string | undefined) {
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Action': 'session_login',
        },
        body: JSON.stringify({ password }),
      });

      if(!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      console.log(data);

      // add token to cookie, expire in 1 hour
      document.cookie = `token=${data.token};max-age=3600`;

      setSuccess('Login successful');
      setError(null);
      router.push('/dashboard');
    } catch (error) {
      setError('Login failed');
      setSuccess(null);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(password);
        }}
      >
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}