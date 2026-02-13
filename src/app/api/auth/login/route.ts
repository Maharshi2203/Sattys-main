import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json()

        // Hardcoded credentials as requested by user
        // In a real production app with multiple users, this should be in a database
        if (username === 'Foodfixingcompany123' && password === 's1a1t1y1a1') {
            const payload = {
                id: 1,
                username,
                role: 'admin'
            }

            const token = generateToken(payload)

            // Set the HTTP-only cookie
            const cookieStore = await cookies()
            cookieStore.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/'
            })

            return NextResponse.json({ success: true, user: payload })
        }

        return NextResponse.json(
            { error: 'Invalid username or password' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
