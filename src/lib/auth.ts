import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'kemenag_loket_jwt_secret_key_2026';
const TOKEN_NAME = 'loket_token';

export interface UserPayload {
  id: number;
  username: string;
  role: string;
  name?: string | null;
}

export function signToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(): Promise<UserPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
