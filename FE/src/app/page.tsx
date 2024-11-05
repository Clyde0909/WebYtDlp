"use client";

import React from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  // get token from cookie
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }

  // functions for api routes
  async function checkTokenOnServer(token: string | undefined) {
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'check_token', token }),
      });

      if (!res.ok) {
        throw new Error('Token check failed');
      }

      return res.json();
    }
    catch (error) {
      console.error(error);
    }
  }

  async function checkInitOnServer() {
    try {
      const res = await fetch('/api/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Action': 'init_check'
        },
      });

      if (!res.ok) {
        throw new Error('Init check failed');
      }

      return res.json();
    }
    catch (error) {
      console.error(error);
    }
  }

  const router = useRouter();

  React.useEffect(() => {
    // check Token is exist
    const token = getCookie('token');

    // check token on server
    if(token){
      checkTokenOnServer(token)
      .then((data) => {
        console.log(data);
        // if(data && data.success){
        //   redirect('/dashboard');
        // }else{
        //   redirect('/login');
        // }
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      checkInitOnServer().then((data) => {
        console.log(data.isInit);
        // if data.isInit is true, redirect to Login page
        if(data.isInit){
          router.push('/login');
        } else {
          router.push('/register');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }, []);
  
  return (
    <div className="root_redirect">
      <h1>Redirecting...</h1>
    </div>
  );
}
