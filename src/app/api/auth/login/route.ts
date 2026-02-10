import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

// 3️⃣ BACKEND SECURITY: Input Validation Schema
const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100)
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 })
    }

    const { username, password } = result.data

    // 4️⃣ DATABASE SECURITY: Use Parameterized Queries (ORMs handle this)
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      // 8️⃣ COMMON ATTACK PREVENTION: Prevent Username Enumeration
      // Return generic "Invalid credentials" error
      // Ideally use constant-time comparison here if timing attacks are a concern
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 1️⃣ AUTHENTICATION & AUTHORIZATION: Secure Token Generation
    const token = await generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    })

    const response = NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } })

    // 2️⃣ FRONTEND SECURITY: Secure HTTP-Only Cookies
    // Prevent XSS access to the token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Use 'strict' if API and frontend are on same origin/port exclusively
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
