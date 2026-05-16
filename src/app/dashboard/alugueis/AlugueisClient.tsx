'use client'

import { useState } from 'react'
import { Plus, Search, Tag, X, CheckCircle, AlertTriangle, MessageCircle, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type RentalStatus = 'ativo' | 'devolvido' | 'atrasado' | 'cancelado'
type PayMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'outro'

const STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo', devolvido: 'Devolvido', atrasado: 'Atrasado', cancelado: 'Cancelado'
}
const PAY_LABELS: Record<string, string> = {
  dinheiro: 'Dinheiro', pix: 'PIX', cartao_credito: 'Cartão Crédito',
  cartao_debito: 'Cartão Débito', outro: 'Outro'
}

interface Props {
  rentals: any[]
  customers: any[]
  availableItems: any[]
}

export default function AlugueisClient({ rentals: initial, customers, availableItems }: Props) {
  const [rentals, setRentals] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [modal, setModal] = useState(false)
  const [returnModal, setReturnModal] = useState<any>(null)
  const [viewModal, setViewModal] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [returnPayMethod, setReturnPayMethod] = useState<PayMethod>('pix')

  // New rental form
  const [customerId, setCustomerId] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [rentalDate, setRentalDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedReturn, setExpectedReturn] = useState('')
  const [payMethod, setPayMethod] = useState<PayMethod>('pix')
  const [notes, setNotes] = useState('')
  const [discount, setDiscount] = useState(0)

  const filtered = rentals.filter(r => {
    const name = r.customers?.full_name?.toLowerCase() || ''
    const matchSearch = name.includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalPrice = availableItems
    .filter(i => selectedItems.includes(i.id))
    .reduce((s, i) => s + Number(i.rental_price), 0) - discount

  const deposit = totalPrice * 0.5

  async function createRental() {
    if (!customerId || selectedItems.length === 0) return
    setSaving(true)

    const { data: rental } = await supabase.from('rentals').insert({
      customer_id: customerId,
      rental_date: rentalDate,
      expected_return: expectedReturn || null,
      total_amount: totalPrice,
      deposit_paid: deposit,
      status: 'ativo',
      discount_amount: discount,
      notes: notes || null,
    }).select().single()

    if (rental) {
      await supabase.from('rental_items').insert(
        selectedItems.map(id => ({
          rental_id: rental.id,
          item_id: id,
          rental_price: availableItems.find(i => i.id === id)?.rental_price || 0,
        }))
      )
      await supabase.from('items').update({ status: 'alugado' }).in('id', selectedItems)
      await supabase.from('rental_payments').insert({
        rental_id: rental.id,
        payment_type: 'deposito',
        amount: deposit,
        payment_method: payMethod,
      })

      // Add points (1 point per R$10)
      const pts = Math.floor(totalPrice / 10)
      if (pts > 0) {
        // points updated via trigger or manually — just log history
        await supabase.from('point_history').insert({
          customer_id: customerId,
          points_delta: pts,
          reason: 'Aluguel realizado',
          reference_id: rental.id,
        })
      }

      const { data: full } = await supabase.from('rentals')
        .select('*, customers(full_name, whatsapp), rental_items(*, items(name, photo_url, rental_price))')
        .eq('id', rental.id).single()

      if (full) setRentals(prev => [full, ...prev])
    }

    setSaving(false)
    setModal(false)
    setCustomerId(''); setSelectedItems([]); setNotes(''); setDiscount(0)
  }

  async function markReturned(rental: any) {
    setSaving(true)
    await supabase.from('rentals').update({ status: 'devolvido', actual_return: new Date().toISOString().split('T')[0] }).eq('id', rental.id)
    const itemIds = rental.rental_items?.map((ri: any) => ri.item_id) || []
    if (itemIds.length) await supabase.from('items').update({ status: 'disponivel' }).in('id', itemIds)
    if (rental.balance_due > 0) {
      await supabase.from('rental_payments').insert({
        rental_id: rental.id,
        payment_type: 'saldo',
        amount: rental.balance_due,
        payment_method: returnPayMethod,
      })
    }
    setRentals(prev => prev.map(r => r.id === rental.id ? { ...r, status: 'devolvido', actual_return: new Date().toISOString().split('T')[0] } : r))
    setSaving(false)
    setReturnModal(null)
  }

  function whatsappText(r: any) {
    const name = r.customers?.full_name?.split(' ')[0] || 'Cliente'
    const bal = Number(r.balance_due).toFixed(2)
    return `Olá ${name}! 😊❄️ Passando para lembrar que o seu aluguel na Simply Frio está aguardando devolução. O saldo restante é de *R$ ${bal}*. Qualquer dúvida, estamos à disposição! 💙`
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Aluguéis</h1>
          <p style={{ color: 'var(--sf-gray)' }}>{rentals.filter(r => r.status === 'ativo').length} ativos</p>
        </div>
        <button onClick={() => setModal(true)} className="sf-btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo Aluguel
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sf-gray)' }} />
          <input className="sf-input pl-9" placeholder="Buscar por cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['todos', 'ativo', 'devolvido', 'atrasado', 'cancelado'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{ background: filterStatus === s ? 'var(--sf-accent)' : 'rgba(255,255,255,0.06)', color: filterStatus === s ? 'white' : 'var(--sf-gray)' }}>
              {s === 'todos' ? 'Todos' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="sf-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Cliente', 'Data', 'Devolução', 'Total', 'Depósito', 'Saldo', 'Status', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--sf-gray)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center" style={{ color: 'var(--sf-gray)' }}>
                <Tag size={36} className="mx-auto mb-3 opacity-30" /><p>Nenhum aluguel encontrado</p>
              </td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-3 text-sm font-medium text-white">{r.customers?.full_name || '—'}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>{new Date(r.rental_date).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>
                  {r.expected_return ? new Date(r.expected_return).toLocaleDateString('pt-BR') : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-white">R$ {Number(r.total_amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#2ecc71' }}>R$ {Number(r.deposit_paid).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: Number(r.balance_due) > 0 ? '#f39c12' : 'var(--sf-gray)' }}>
                  R$ {Number(r.balance_due).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`sf-badge badge-${r.status}`}>{STATUS_LABELS[r.status]}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewModal(r)} className="p-1.5 rounded transition-all" style={{ color: 'var(--sf-gray)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--sf-gray)')}>
                      <Eye size={15} />
                    </button>
                    {r.status === 'ativo' && (
                      <>
                        <button onClick={() => setReturnModal(r)} className="p-1.5 rounded transition-all" style={{ color: '#2ecc71' }}>
                          <CheckCircle size={15} />
                        </button>
                        {r.customers?.whatsapp && (
                          <a href={`https://wa.me/55${r.customers.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappText(r))}`}
                            target="_blank" rel="noopener noreferrer" className="p-1.5 rounded" style={{ color: '#25D366' }}>
                            <MessageCircle size={15} />
                          </a>
                        )}
                      </>
                    )}
                    {r.status === 'ativo' && Number(r.balance_due) > 0 && (
                      <button title="Marcar como atrasado"
                        onClick={async () => {
                          await supabase.from('rentals').update({ status: 'atrasado' }).eq('id', r.id)
                          setRentals(prev => prev.map(x => x.id === r.id ? { ...x, status: 'atrasado' } : x))
                        }}
                        className="p-1.5 rounded transition-all" style={{ color: '#f39c12' }}>
                        <AlertTriangle size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setViewModal(null)}>
          <div className="sf-card max-w-md w-full p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Detalhes do Aluguel</h3>
              <button onClick={() => setViewModal(null)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div><span style={{ color: 'var(--sf-gray)' }}>Cliente: </span><span className="text-white">{viewModal.customers?.full_name}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Data: </span><span className="text-white">{new Date(viewModal.rental_date).toLocaleDateString('pt-BR')}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Total: </span><span className="text-white font-bold">R$ {Number(viewModal.total_amount).toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Depósito (50%): </span><span style={{ color: '#2ecc71' }}>R$ {Number(viewModal.deposit_paid).toFixed(2)}</span></div>
              <div><span style={{ color: 'var(--sf-gray)' }}>Saldo na devolução: </span><span style={{ color: '#f39c12' }}>R$ {Number(viewModal.balance_due).toFixed(2)}</span></div>
              {viewModal.notes && <div><span style={{ color: 'var(--sf-gray)' }}>Obs: </span><span className="text-white">{viewModal.notes}</span></div>}
            </div>
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--sf-gray)' }}>Peças alugadas:</h4>
            <div className="space-y-2">
              {viewModal.rental_items?.map((ri: any) => (
                <div key={ri.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--sf-navy-dark)' }}>
                  {ri.items?.photo_url && <img src={ri.items.photo_url} alt="" className="w-10 h-10 rounded object-cover" />}
                  <span className="text-sm text-white flex-1">{ri.items?.name}</span>
                  <span className="text-sm" style={{ color: 'var(--sf-accent)' }}>R$ {Number(ri.rental_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Return modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setReturnModal(null)}>
          <div className="sf-card max-w-sm w-full p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Confirmar Devolução</h3>
              <button onClick={() => setReturnModal(null)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>
            <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--sf-navy-dark)' }}>
              <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Cliente</p>
              <p className="text-white font-medium">{returnModal.customers?.full_name}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--sf-gray)' }}>Saldo a receber na devolução</p>
              <p className="text-xl font-bold" style={{ color: '#f39c12' }}>R$ {Number(returnModal.balance_due).toFixed(2)}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Forma de pagamento do saldo</label>
              <select className="sf-input" value={returnPayMethod} onChange={e => setReturnPayMethod(e.target.value as PayMethod)}>
                {Object.entries(PAY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReturnModal(null)} className="sf-btn-secondary flex-1">Cancelar</button>
              <button onClick={() => markReturned(returnModal)} disabled={saving} className="sf-btn-primary flex-1 flex items-center justify-center gap-2">
                <CheckCircle size={16} /> {saving ? '...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New rental modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="sf-card max-w-2xl w-full p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Novo Aluguel</h3>
              <button onClick={() => setModal(false)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Cliente *</label>
                <select className="sf-input" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                  <option value="">Selecione a cliente...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Data do Aluguel</label>
                <input className="sf-input" type="date" value={rentalDate} onChange={e => setRentalDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Previsão de Devolução</label>
                <input className="sf-input" type="date" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Desconto (R$)</label>
                <input className="sf-input" type="number" step="0.01" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Pagamento Depósito (50%)</label>
                <select className="sf-input" value={payMethod} onChange={e => setPayMethod(e.target.value as PayMethod)}>
                  {Object.entries(PAY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Observações</label>
                <input className="sf-input" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--sf-gray)' }}>
                Selecionar Peças ({selectedItems.length} selecionada{selectedItems.length !== 1 ? 's' : ''})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                {availableItems.map(item => {
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
                        <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>{item.size || '—'}</p>
                        <p className="text-xs font-semibold" style={{ color: 'var(--sf-accent)' }}>R$ {Number(item.rental_price).toFixed(2)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Summary */}
            {selectedItems.length > 0 && (
              <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--sf-navy-dark)' }}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--sf-gray)' }}>Subtotal</span>
                  <span className="text-white">R$ {(totalPrice + discount).toFixed(2)}</span>
                </div>
                {discount > 0 && <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--sf-gray)' }}>Desconto</span>
                  <span style={{ color: '#e74c3c' }}>- R$ {discount.toFixed(2)}</span>
                </div>}
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-white">Total</span>
                  <span className="text-white">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'var(--sf-gray)' }}>Depósito agora (50%)</span>
                  <span style={{ color: '#2ecc71' }} className="font-bold">R$ {deposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--sf-gray)' }}>Saldo na devolução (50%)</span>
                  <span style={{ color: '#f39c12' }} className="font-bold">R$ {deposit.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="sf-btn-secondary flex-1">Cancelar</button>
              <button onClick={createRental} disabled={saving || !customerId || selectedItems.length === 0} className="sf-btn-primary flex-1">
                {saving ? 'Registrando...' : 'Registrar Aluguel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
