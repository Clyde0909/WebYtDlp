import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const action_code = await req.headers.get('action');
  const body = await req.json();
  const password = body.password;

  console.log('POST', action_code, password);
  
  switch (action_code) {
    case 'session_register':
      {
        // return NextResponse.json({ message: 'Session Register' }, { status: 200 });
        const response = await registerSession(password);
        return NextResponse.json(response, { status: 200 });
      }
    case 'session_login':
      {
        return NextResponse.json({ message: 'Session Login' }, { status: 200 });
        // const response = await loginSession(password);
        // return NextResponse.json(response, { status: 200 });
      }
    default:
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const action_code = await req.headers.get('action')
  console.log('GET', action_code);
  switch (action_code) {
    case 'init_check':
      const response = await checkInitOnServer();
      return NextResponse.json(response, { status: 200 });
    default:
      return NextResponse.json({ message: 'Invalid Action' }, { status: 400 });
  }
}

async function checkTokenOnServer(token: string | undefined) {
  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/check_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  return res.json();
}

async function registerSession(password: string | undefined) {
  if (!password) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/register_session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  return res.json();
}

async function loginSession(password: string | undefined) {
  if (!password) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/login_session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  return res.json();
}

async function checkInitOnServer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/is_init`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}