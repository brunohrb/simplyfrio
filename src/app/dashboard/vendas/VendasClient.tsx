'use client'

import { useState } from 'react'
import { Plus, Search, ShoppingBag, X, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const PAY_LABELS: Record<string, string> = {
  dinheiro: 'Dinheiro', pix: 'PIX', cartao_credito: 'Cartão Crédito',
  cartao_debito: 'Cartão Débito', outro: 'Outro'
}

interface Props { sales: any[]; customers: any[]; saleItems: any[] }

export default function VendasClient({ sales: initial, customers, saleItems }: Props) {
  const [sales, setSales] = useState(initial)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [viewModal, setViewModal] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const [customerId, setCustomerId] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [payMethod, setPayMethod] = useState('pix')
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')

  const filtered = sales.filter(s => {
    const name = s.customers?.full_name?.toLowerCase() || ''
    return name.includes(search.toLowerCase())
  })

  const totalPrice = saleItems
    .filter(i => selectedItems.includes(i.id))
    .reduce((s, i) => s + Number(i.sale_price || i.rental_price), 0) - discount

  async function createSale() {
    if (selectedItems.length === 0) return
    setSaving(true)

    const { data: sale } = await supabase.from('sales').insert({
      customer_id: customerId || null,
      sale_date: new Date().toISOString().split('T')[0],
      total_amount: totalPrice,
      payment_method: payMethod,
      discount_amount: discount,
      notes: notes || null,
    }).select().single()

    if (sale) {
      await supabase.from('sale_items').insert(
        selectedItems.map(id => ({
          sale_id: sale.id,
          item_id: id,
          sale_price: saleItems.find(i => i.id === id)?.sale_price || 0,
        }))
      )
      await supabase.from('items').update({ status: 'vendido' }).in('id', selectedItems)

      if (customerId) {
        const pts = Math.floor(totalPrice / 10)
        if (pts > 0) {
          await supabase.from('point_history').insert({
            customer_id: customerId,
            points_delta: pts,
            reason: 'Compra realizada',
            reference_id: sale.id,
          })
        }
      }

      const { data: full } = await supabase.from('sales')
        .select('*, customers(full_name), sale_items(*, items(name, photo_url))')
        .eq('id', sale.id).single()

      if (full) setSales(prev => [full, ...prev])
    }

    setSaving(false)
    setModal(false)
    setCustomerId(''); setSelectedItems([]); setDiscount(0); setNotes('')
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendas</h1>
          <p style={{ color: 'var(--sf-gray)' }}>Rotação de estoque</p>
        </div>
        <button onClick={() => setModal(true)} className="sf-btn-primary flex items-center gap-2">
          <Plus size={16} /> Nova Venda
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sf-gray)' }} />
        <input className="sf-input pl-9 max-w-sm" placeholder="Buscar por cliente..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="sf-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Data', 'Cliente', 'Total', 'Pagamento', 'Peças', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--sf-gray)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center" style={{ color: 'var(--sf-gray)' }}>
                <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" /><p>Nenhuma venda registrada</p>
              </td></tr>
            )}
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>{new Date(s.sale_date).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm font-medium text-white">{s.customers?.full_name || 'Sem cliente'}</td>
                <td className="px-4 py-3 text-sm font-bold text-white">R$ {Number(s.total_amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>{PAY_LABELS[s.payment_method] || s.payment_method}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>{s.sale_items?.length || 0} peça(s)</td>
                <td className="px-4 py-3">
                  <button onClick={() => setViewModal(s)} className="p-1.5 rounded transition-all" style={{ color: 'var(--sf-gray)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--sf-gray)')}>
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setViewModal(null)}>
          <div className="sf-card max-w-md w-full p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Detalhes da Venda</h3>
              <button onClick={() => setViewModal(null)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div><span style={{ color: 'var(--sf-gray)' }}>Cliente: </span><span className="text-white">{viewModal.customers?.full_name || '—'}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Data: </span><span className="text-white">{new Date(viewModal.sale_date).toLocaleDateString('pt-BR')}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Total: </span><span className="text-white font-bold">R$ {Number(viewModal.total_amount).toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Pagamento: </span><span className="text-white">{PAY_LABELS[viewModal.payment_method]}</span></div>
            </div>
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--sf-gray)' }}>Peças vendidas:</h4>
            <div className="space-y-2">
              {viewModal.sale_items?.map((si: any) => (
                <div key={si.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--sf-navy-dark)' }}>
                  {si.items?.photo_url && <img src={si.items.photo_url} alt="" className="w-10 h-10 rounded object-cover" />}
                  <span className="text-sm text-white flex-1">{si.items?.name}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--sf-accent)' }}>R$ {Number(si.sale_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="sf-card max-w-2xl w-full p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Nova Venda</h3>
              <button onClick={() => setModal(false)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Cliente (opcional)</label>
                <select className="sf-input" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                  <option value="">Venda avulsa (sem cliente)</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Forma de Pagamento</label>
                <select className="sf-input" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                  {Object.entries(PAY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Desconto (R$)</label>
                <input className="sf-input" type="number" step="0.01" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--sf-gray)' }}>Selecionar Peças para Venda</label>
              {saleItems.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Nenhuma peça com preço de venda cadastrado. Adicione preços de venda no estoque.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {saleItems.map(item => {
                    const sel = selectedItems.includes(item.id)
                    return (
                      <button key={item.id} onClick={() => setSelectedItems(prev => sel ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                        className="flex items-center gap-2 p-2 rounded-lg text-left transition-all"
                        style={{ background: sel ? 'rgba(74,144,217,0.15)' : 'var(--sf-navy-dark)', border: `1px solid ${sel ? 'var(--sf-accent)' : 'rgba(255,255,255,0.08)'}` }}>
                        {item.photo_url ? (
                          <img src={item.photo_url} alt="" className="w-10 h-12 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-12 rounded flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>{item.status}</p>
                          <p className="text-xs font-semibold" style={{ color: '#2ecc71' }}>R$ {Number(item.sale_price).toFixed(2)}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--sf-navy-dark)' }}>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-white">Total da Venda</span>
                  <span style={{ color: '#2ecc71' }}>R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="sf-btn-secondary flex-1">Cancelar</button>
              <button onClick={createSale} disabled={saving || selectedItems.length === 0} className="sf-btn-primary flex-1">
                {saving ? 'Registrando...' : 'Confirmar Venda'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
