"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
  { href: '/admin/shop-info', label: 'Shop Info', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-sidebar-border",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-8 border-b border-sidebar-border">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-primary">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-display text-lg font-bold text-sidebar-foreground tracking-tight leading-none mb-1">Admin Panel</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/60 truncate">{user?.username}</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-4">Main Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-white text-primary shadow-xl shadow-black/10"
                      : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                  {!isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 space-y-2 border-t border-sidebar-border bg-sidebar-accent/50 backdrop-blur-sm">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10 rounded-2xl transition-all font-bold text-sm"
            >
              <Store className="w-5 h-5" />
              <span>View Website</span>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 px-4 py-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/10 rounded-2xl font-bold text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/50 h-20 flex items-center">
          <div className="flex items-center justify-between w-full px-4 lg:px-12">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-2xl hover:bg-primary/5 text-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            <div className="hidden lg:block">
              <h2 className="text-xl font-display font-bold text-foreground tracking-tight">
                {navItems.find(item => item.href === pathname)?.label || 'Overview'}
              </h2>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">Logged in as</p>
                <p className="text-sm font-bold text-foreground">{user?.username}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold shadow-inner">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-12 flex-1 animate-fade-in-up">
          {children}
        </main>
      </div>

      <button
        className={cn(
          "fixed bottom-6 right-6 lg:hidden z-50 w-14 h-14 bg-primary text-white rounded-[2rem] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
          sidebarOpen ? "rotate-90" : "rotate-0"
        )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  )
}
