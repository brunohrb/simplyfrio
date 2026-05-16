import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Package, Tag, Users, DollarSign, AlertTriangle, TrendingUp, Clock, Star } from 'lucide-react'

async function getStats() {
  const [items, rentals, customers, sales] = await Promise.all([
    supabase.from('items').select('status'),
    supabase.from('rentals').select('status, total_amount, deposit_paid, balance_due, rental_date'),
    supabase.from('customers').select('id', { count: 'exact' }),
    supabase.from('sales').select('total_amount, sale_date'),
  ])

  const allItems = items.data || []
  const allRentals = rentals.data || []
  const allSales = sales.data || []

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const activeRentals = allRentals.filter(r => r.status === 'ativo')
  const overdueRentals = allRentals.filter(r => r.status === 'atrasado')
  const monthlyRentals = allRentals.filter(r => r.rental_date >= monthStart && r.status !== 'cancelado')
  const monthlySales = allSales.filter(s => s.sale_date >= monthStart)

  const monthlyRevenue =
    monthlyRentals.reduce((s, r) => s + (r.deposit_paid || 0), 0) +
    monthlySales.reduce((s, r) => s + (r.total_amount || 0), 0)

  const pendingBalance = activeRentals.reduce((s, r) => s + (r.balance_due || 0), 0)

  return {
    totalItems: allItems.length,
    availableItems: allItems.filter(i => i.status === 'disponivel').length,
    rentedItems: allItems.filter(i => i.status === 'alugado').length,
    activeRentals: activeRentals.length,
    overdueRentals: overdueRentals.length,
    monthlyRevenue,
    pendingBalance,
    totalCustomers: customers.count || 0,
  }
}

async function getRecentRentals() {
  const { data } = await supabase
    .from('rentals')
    .select('*, customers(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

async function getBirthdaysThisMonth() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const { data } = await supabase
    .from('customers')
    .select('full_name, birthday, whatsapp')
    .not('birthday', 'is', null)
    .like('birthday', `%-${month}-%`)
    .limit(5)
  return data || []
}

export default async function DashboardPage() {
  const session = await getSession()
  const [stats, recentRentals, birthdays] = await Promise.all([
    getStats(),
    getRecentRentals(),
    getBirthdaysThisMonth(),
  ])

  const cards = [
    { label: 'Total no Estoque', value: stats.totalItems, icon: Package, color: '#4a90d9', sub: `${stats.availableItems} disponíveis` },
    { label: 'Aluguéis Ativos', value: stats.activeRentals, icon: Tag, color: '#2ecc71', sub: `${stats.rentedItems} peças alugadas` },
    { label: 'Total de Clientes', value: stats.totalCustomers, icon: Users, color: '#9b59b6', sub: 'cadastrados' },
    ...(session?.role === 'admin' ? [
      { label: 'Receita do Mês', value: `R$ ${stats.monthlyRevenue.toFixed(2)}`, icon: TrendingUp, color: '#2ecc71', sub: 'aluguéis + vendas' },
      { label: 'Saldo a Receber', value: `R$ ${stats.pendingBalance.toFixed(2)}`, icon: DollarSign, color: '#f39c12', sub: 'na devolução' },
      { label: 'Aluguéis Atrasados', value: stats.overdueRentals, icon: AlertTriangle, color: '#e74c3c', sub: 'aguardando devolução' },
    ] : []),
  ]

  function statusLabel(s: string) {
    const m: Record<string, string> = { ativo: 'Ativo', devolvido: 'Devolvido', atrasado: 'Atrasado', cancelado: 'Cancelado' }
    return m[s] || s
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p style={{ color: 'var(--sf-gray)' }}>Visão geral do negócio</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="sf-card p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: `${card.color}20` }}>
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-sm mb-0.5" style={{ color: 'var(--sf-gray)' }}>{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--sf-gray)' }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent rentals */}
        <div className="sf-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} style={{ color: 'var(--sf-accent)' }} />
            <h2 className="font-semibold text-white">Últimos Aluguéis</h2>
          </div>
          <div className="flex flex-col gap-3">
            {recentRentals.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Nenhum aluguel registrado.</p>
            )}
            {recentRentals.map((r: { id: string; customers?: { full_name: string } | null; rental_date: string; total_amount: number; status: string }) => (
              <div key={r.id} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-sm font-medium text-white">{r.customers?.full_name || 'Cliente não identificado'}</p>
                  <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>{new Date(r.rental_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">R$ {Number(r.total_amount).toFixed(2)}</p>
                  <span className={`sf-badge badge-${r.status}`}>{statusLabel(r.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Birthdays */}
        <div className="sf-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} style={{ color: '#f39c12' }} />
            <h2 className="font-semibold text-white">Aniversariantes do Mês</h2>
          </div>
          <div className="flex flex-col gap-3">
            {birthdays.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Nenhum aniversariante este mês.</p>
            )}
            {birthdays.map((c: { full_name: string; birthday: string; whatsapp?: string }, i) => (
              <div key={i} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(243,156,18,0.15)', color: '#f39c12' }}>
                    {c.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{c.full_name}</p>
                    <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>
                      {c.birthday ? new Date(c.birthday + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : ''}
                    </p>
                  </div>
                </div>
                {c.whatsapp && (
                  <a
                    href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}?text=Olá ${c.full_name.split(' ')[0]}! 🎉 A Simply Frio deseja a você um feliz aniversário! Temos um cupom especial para você: ANIVER10`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-btn-primary text-xs px-3 py-1.5"
                    style={{ background: '#25D366', padding: '6px 12px', fontSize: '12px' }}
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
