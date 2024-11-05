"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegPage() {
  const [password, setPassword] = useState<string | undefined>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  async function handleRegister(password: string | undefined) {
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Action': 'session_register',
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      const data = await res.json();
      console.log(data);

      // add token to cookie, expire in 1 hour
      document.cookie = `token=${data.token};max-age=3600`;

      setSuccess('Registration successful');
      setError(null);
      router.push('/dashboard');
    } catch (error) {
      setError('Registration failed');
      setSuccess(null);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister(password);
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}