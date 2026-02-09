"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, User, AlertCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-12 pb-6">
          <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center bg-primary/10 rounded-[2rem] text-primary">
            <Lock className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-foreground tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Authorized access only
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border border-destructive/20 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium opacity-50">
                &copy; {new Date().getFullYear()} Satty&apos;s Food Distributor. All rights reserved.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
