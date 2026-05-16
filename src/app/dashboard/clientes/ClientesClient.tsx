'use client'

import { useState } from 'react'
import { Plus, Search, Users, Edit2, X, MessageCircle, Star, Gift } from 'lucide-react'
import { Customer } from '@/lib/types'
import { supabase } from '@/lib/supabase'

const EMPTY: Partial<Customer> = {
  full_name: '', phone: '', whatsapp: '', email: '', birthday: '', cpf: '', address: '', notes: ''
}

export default function ClientesClient({ customers: initial }: { customers: Customer[] }) {
  const [customers, setCustomers] = useState(initial)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Customer>>(EMPTY)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)

  const filtered = customers.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search) ||
    (c.whatsapp || '').includes(search)
  )

  function openNew() { setEditing(EMPTY); setIsEdit(false); setModal(true) }
  function openEdit(c: Customer) { setEditing({ ...c }); setIsEdit(true); setModal(true) }

  async function save() {
    setSaving(true)
    const payload = {
      full_name: editing.full_name,
      phone: editing.phone || null,
      whatsapp: editing.whatsapp || null,
      email: editing.email || null,
      birthday: editing.birthday || null,
      cpf: editing.cpf || null,
      address: editing.address || null,
      notes: editing.notes || null,
    }

    if (isEdit && editing.id) {
      const { data } = await supabase.from('customers').update(payload).eq('id', editing.id).select().single()
      if (data) setCustomers(prev => prev.map(c => c.id === data.id ? data : c))
    } else {
      const { data } = await supabase.from('customers').insert(payload).select().single()
      if (data) setCustomers(prev => [...prev, data])
    }
    setSaving(false)
    setModal(false)
  }

  function getBirthdayMessage(name: string) {
    return `Olá ${name.split(' ')[0]}! 🎉❄️ A Simply Frio deseja a você um feliz aniversário! Como presente especial, temos um cupom de 10% de desconto no seu próximo aluguel: *ANIVER10* 🎁 Muito obrigada pela sua preferência! 💙`
  }

  function isToday(birthday?: string) {
    if (!birthday) return false
    const today = new Date()
    const b = new Date(birthday + 'T12:00:00')
    return b.getDate() === today.getDate() && b.getMonth() === today.getMonth()
  }

  function isThisMonth(birthday?: string) {
    if (!birthday) return false
    const today = new Date()
    const b = new Date(birthday + 'T12:00:00')
    return b.getMonth() === today.getMonth()
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p style={{ color: 'var(--sf-gray)' }}>{customers.length} clientes cadastrados</p>
        </div>
        <button onClick={openNew} className="sf-btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sf-gray)' }} />
        <input className="sf-input pl-9 max-w-sm" placeholder="Buscar por nome ou telefone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--sf-gray)' }}>
          <Users size={48} className="mb-4 opacity-30" />
          <p>Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="sf-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Nome', 'WhatsApp', 'Aniversário', 'Pontos', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--sf-gray)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'rgba(74,144,217,0.15)', color: 'var(--sf-accent)' }}>
                        {c.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{c.full_name}</span>
                          {isToday(c.birthday) && <span className="text-lg">🎂</span>}
                          {!isToday(c.birthday) && isThisMonth(c.birthday) && <span className="text-sm">🎉</span>}
                        </div>
                        {c.email && <div className="text-xs" style={{ color: 'var(--sf-gray)' }}>{c.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>{c.whatsapp || c.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--sf-gray)' }}>
                    {c.birthday ? new Date(c.birthday + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} style={{ color: '#f39c12' }} />
                      <span className="text-sm text-white">{c.points || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg transition-all"
                        style={{ color: 'var(--sf-gray)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--sf-gray)')}>
                        <Edit2 size={15} />
                      </button>
                      {c.whatsapp && (
                        <a href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(getBirthdayMessage(c.full_name))}`}
                          target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded-lg transition-all" style={{ color: '#25D366' }}>
                          <MessageCircle size={15} />
                        </a>
                      )}
                      <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg transition-all" style={{ color: '#f39c12' }}>
                        <Gift size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSelected(null)}>
          <div className="sf-card max-w-md w-full p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Enviar Mensagem</h3>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>
            <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--sf-navy-dark)' }}>
              <p className="text-sm text-white whitespace-pre-wrap">{getBirthdayMessage(selected.full_name)}</p>
            </div>
            {selected.whatsapp ? (
              <a href={`https://wa.me/55${selected.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(getBirthdayMessage(selected.full_name))}`}
                target="_blank" rel="noopener noreferrer"
                className="sf-btn-primary w-full flex items-center justify-center gap-2"
                style={{ background: '#25D366', display: 'flex', textDecoration: 'none' }}>
                <MessageCircle size={16} /> Enviar pelo WhatsApp
              </a>
            ) : (
              <p className="text-sm text-center" style={{ color: 'var(--sf-gray)' }}>WhatsApp não cadastrado para esta cliente.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit/Create modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="sf-card max-w-lg w-full p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{isEdit ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setModal(false)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Nome Completo *</label>
                <input className="sf-input" value={editing.full_name || ''} onChange={e => setEditing(p => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Telefone</label>
                <input className="sf-input" value={editing.phone || ''} onChange={e => setEditing(p => ({ ...p, phone: e.target.value }))} placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>WhatsApp</label>
                <input className="sf-input" value={editing.whatsapp || ''} onChange={e => setEditing(p => ({ ...p, whatsapp: e.target.value }))} placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>E-mail</label>
                <input className="sf-input" type="email" value={editing.email || ''} onChange={e => setEditing(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Data de Nascimento 🎂</label>
                <input className="sf-input" type="date" value={editing.birthday || ''} onChange={e => setEditing(p => ({ ...p, birthday: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>CPF</label>
                <input className="sf-input" value={editing.cpf || ''} onChange={e => setEditing(p => ({ ...p, cpf: e.target.value }))} placeholder="000.000.000-00" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Endereço</label>
                <input className="sf-input" value={editing.address || ''} onChange={e => setEditing(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Observações</label>
                <textarea className="sf-input" rows={2} value={editing.notes || ''} onChange={e => setEditing(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="sf-btn-secondary flex-1">Cancelar</button>
              <button onClick={save} disabled={saving || !editing.full_name} className="sf-btn-primary flex-1">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
