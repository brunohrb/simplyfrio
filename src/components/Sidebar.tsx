'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SnowflakeIcon } from './Snowflake'
import {
  LayoutDashboard, Package, Users, ShoppingBag, BarChart3, LogOut, Camera, Tag
} from 'lucide-react'

interface SidebarProps {
  role: 'admin' | 'user'
  userName: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/estoque', icon: Package, label: 'Estoque' },
    { href: '/dashboard/alugueis', icon: Tag, label: 'Aluguéis' },
    { href: '/dashboard/clientes', icon: Users, label: 'Clientes' },
    { href: '/dashboard/vendas', icon: ShoppingBag, label: 'Vendas' },
    ...(role === 'admin' ? [{ href: '/dashboard/financeiro', icon: BarChart3, label: 'Financeiro' }] : []),
    { href: '/dashboard/provador', icon: Camera, label: 'Provador Virtual' },
  ]

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: 'var(--sf-navy-dark)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="flex flex-col items-center py-8 px-6 gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <SnowflakeIcon size={40} className="text-blue-400 animate-spin-slow" />
        <div className="text-center">
          <div className="font-bold text-lg tracking-widest text-white">SIMPLY FRIO</div>
          <div className="text-xs tracking-wider" style={{ color: 'var(--sf-gray)' }}>Sistema de Gestão</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(74,144,217,0.15)' : 'transparent',
                color: active ? '#4a90d9' : 'var(--sf-gray)',
                borderLeft: active ? '3px solid #4a90d9' : '3px solid transparent',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'var(--sf-accent)' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{userName}</div>
            <div className="text-xs" style={{ color: 'var(--sf-gray)' }}>
              {role === 'admin' ? 'Administradora' : 'Funcionária'}
            </div>
          </div>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm mt-2 transition-all"
            style={{ color: 'var(--sf-gray)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e74c3c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--sf-gray)')}
          >
            <LogOut size={16} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
