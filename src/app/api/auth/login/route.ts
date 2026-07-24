import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: Request) {
  try {
    const { username, password, turnstileToken } = await request.json();

    // Verify Cloudflare Turnstile token
    if (turnstileToken !== undefined) {
      const turnstileRes = await verifyTurnstileToken(turnstileToken);
      if (!turnstileRes.success) {
        return NextResponse.json(
          { error: 'Verifikasi Turnstile gagal. Silakan coba lagi.' },
          { status: 400 }
        );
      }
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    const userList = await db.select().from(users).where(eq(users.username, username));
    const user = userList[0];

    if (!user) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    };

    const token = signToken(payload);

    const response = NextResponse.json({
      success: true,
      token,
      user: payload,
    });

    // Set cookie
    response.cookies.set('loket_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
