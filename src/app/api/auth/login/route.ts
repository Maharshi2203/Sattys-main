import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, generateToken, hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      if (username === 'Foodfixingcompany123' && password === 's1a1t1y1a1') {
        const hashedPassword = hashPassword('s1a1t1y1a1')
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('admin_users')
          .insert({
            username: 'Foodfixingcompany123',
            email: 'admin@store.com',
            password_hash: hashedPassword,
            role: 'admin'
          })
          .select()
          .single()

        if (createError) {
          return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
        }

        const token = generateToken({ id: newUser.id, username: newUser.username, role: newUser.role })
        const response = NextResponse.json({ success: true, user: { id: newUser.id, username: newUser.username, role: newUser.role } })
        response.cookies.set('admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        })
        return response
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken({ id: user.id, username: user.username, role: user.role })
    const response = NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
