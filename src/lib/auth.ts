import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
}

export function generateToken(payload: { id: number; username: string; role: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { id: number; username: string; role: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string }
    } catch {
        return null
    }
}
