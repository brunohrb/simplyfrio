'use client'

import { useState, useMemo } from 'react'
import { DollarSign, TrendingUp, Tag, ShoppingBag, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const PAY_LABELS: Record<string, string> = {
  dinheiro: 'Dinheiro', pix: 'PIX', cartao_credito: 'Cartão Crédito',
  cartao_debito: 'Cartão Débito', outro: 'Outro'
}

interface Props { payments: any[]; sales: any[]; rentals: any[] }

export default function FinanceiroClient({ payments, sales, rentals }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const monthlyData = useMemo(() => {
    return MONTHS.map((name, idx) => {
      const m = String(idx + 1).padStart(2, '0')
      const rentalRev = payments
        .filter(p => p.paid_at?.startsWith(`${new Date().getFullYear()}-${m}`))
        .reduce((s, p) => s + Number(p.amount), 0)
      const saleRev = sales
        .filter(s => s.sale_date?.startsWith(`${new Date().getFullYear()}-${m}`))
        .reduce((s, sale) => s + Number(sale.total_amount), 0)
      return { name, alugueis: +rentalRev.toFixed(2), vendas: +saleRev.toFixed(2), total: +(rentalRev + saleRev).toFixed(2) }
    })
  }, [payments, sales])

  const currentMonth = String(selectedMonth + 1).padStart(2, '0')

  const monthPayments = payments.filter(p => p.paid_at?.startsWith(`${new Date().getFullYear()}-${currentMonth}`))
  const monthSales = sales.filter(s => s.sale_date?.startsWith(`${new Date().getFullYear()}-${currentMonth}`))
  const monthRentals = rentals.filter(r => r.rental_date?.startsWith(`${new Date().getFullYear()}-${currentMonth}`))

  const totalRentalRev = monthPayments.reduce((s, p) => s + Number(p.amount), 0)
  const totalSaleRev = monthSales.reduce((s, sale) => s + Number(sale.total_amount), 0)
  const totalRev = totalRentalRev + totalSaleRev

  const pendingBalance = rentals
    .filter(r => r.status === 'ativo' || r.status === 'atrasado')
    .reduce((s, r) => s + Number(r.balance_due || 0), 0)

  const payMethodTotals = monthPayments.reduce((acc, p) => {
    acc[p.payment_method] = (acc[p.payment_method] || 0) + Number(p.amount)
    return acc
  }, {} as Record<string, number>)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null
    return (
      <div className="p-3 rounded-xl text-sm" style={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name === 'alugueis' ? 'Aluguéis' : 'Vendas'}: R$ {p.value.toFixed(2)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p style={{ color: 'var(--sf-gray)' }}>Visão financeira completa</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Receita do Mês', value: `R$ ${totalRev.toFixed(2)}`, icon: TrendingUp, color: '#2ecc71', sub: MONTHS[selectedMonth] },
          { label: 'Aluguéis', value: `R$ ${totalRentalRev.toFixed(2)}`, icon: Tag, color: '#4a90d9', sub: `${monthRentals.length} aluguéis` },
          { label: 'Vendas', value: `R$ ${totalSaleRev.toFixed(2)}`, icon: ShoppingBag, color: '#9b59b6', sub: `${monthSales.length} vendas` },
          { label: 'Saldo Pendente', value: `R$ ${pendingBalance.toFixed(2)}`, icon: DollarSign, color: '#f39c12', sub: 'na devolução' },
        ].map(card => (
          <div key={card.label} className="sf-card p-5 flex items-start gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: `${card.color}20` }}>
              <card.icon size={20} style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xs mb-0.5" style={{ color: 'var(--sf-gray)' }}>{card.label}</p>
              <p className="text-lg font-bold text-white">{card.value}</p>
              <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="sf-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} style={{ color: 'var(--sf-accent)' }} />
          <h2 className="font-semibold text-white">Receita Mensal — {new Date().getFullYear()}</h2>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--sf-gray)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--sf-gray)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `R$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="alugueis" fill="#4a90d9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="vendas" fill="#9b59b6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sf-gray)' }}>
            <div className="w-3 h-3 rounded" style={{ background: '#4a90d9' }} /> Aluguéis
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sf-gray)' }}>
            <div className="w-3 h-3 rounded" style={{ background: '#9b59b6' }} /> Vendas
          </div>
        </div>
      </div>

      {/* Month selector + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sf-card p-6">
          <h2 className="font-semibold text-white mb-4">Detalhes por Mês</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {MONTHS.map((m, i) => (
              <button key={m} onClick={() => setSelectedMonth(i)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{ background: selectedMonth === i ? 'var(--sf-accent)' : 'rgba(255,255,255,0.06)', color: selectedMonth === i ? 'white' : 'var(--sf-gray)' }}>
                {m}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--sf-gray)' }}>Total recebido</span>
              <span className="font-bold text-white">R$ {totalRev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--sf-gray)' }}>De aluguéis</span>
              <span style={{ color: '#4a90d9' }}>R$ {totalRentalRev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--sf-gray)' }}>De vendas</span>
              <span style={{ color: '#9b59b6' }}>R$ {totalSaleRev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span style={{ color: 'var(--sf-gray)' }}>Novos aluguéis</span>
              <span className="text-white">{monthRentals.length}</span>
            </div>
          </div>
        </div>

        <div className="sf-card p-6">
          <h2 className="font-semibold text-white mb-4">Formas de Pagamento — {MONTHS[selectedMonth]}</h2>
          <div className="space-y-3">
            {Object.keys(payMethodTotals).length === 0 && (
              <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Sem pagamentos neste mês.</p>
            )}
            {(Object.entries(payMethodTotals) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([method, total]) => {
              const pct = totalRentalRev > 0 ? ((total / totalRentalRev) * 100).toFixed(0) : '0'
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--sf-gray)' }}>{PAY_LABELS[method] || method}</span>
                    <span className="text-white">R$ {(total as number).toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--sf-accent)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="sf-card p-6 mt-6">
        <h2 className="font-semibold text-white mb-4">Pagamentos Recebidos — {MONTHS[selectedMonth]}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Data', 'Tipo', 'Valor', 'Método', 'Cliente'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--sf-gray)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthPayments.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center" style={{ color: 'var(--sf-gray)' }}>Nenhum pagamento neste mês</td></tr>
              )}
              {monthPayments.slice(0, 20).map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="py-2 px-3" style={{ color: 'var(--sf-gray)' }}>{new Date(p.paid_at).toLocaleDateString('pt-BR')}</td>
                  <td className="py-2 px-3 text-white capitalize">{p.payment_type === 'deposito' ? 'Depósito (50%)' : p.payment_type === 'saldo' ? 'Saldo devolução' : p.payment_type}</td>
                  <td className="py-2 px-3 font-medium" style={{ color: '#2ecc71' }}>R$ {Number(p.amount).toFixed(2)}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--sf-gray)' }}>{PAY_LABELS[p.payment_method] || p.payment_method}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--sf-gray)' }}>{p.rentals?.customers?.full_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
