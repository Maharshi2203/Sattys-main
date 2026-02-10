import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'
const encoder = new TextEncoder()

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export async function generateToken(payload: { id: number; username: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(JWT_SECRET))
}

export async function verifyToken(token: string): Promise<{ id: number; username: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET))
    return payload as unknown as { id: number; username: string; role: string }
  } catch {
    return null
  }
}
