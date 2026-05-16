'use client'

import { useState } from 'react'
import { Plus, Search, Package, Edit2, Trash2, X, Camera } from 'lucide-react'
import { Item, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface Props { items: Item[]; categories: Category[] }

const STATUS_OPTIONS = ['disponivel', 'alugado', 'manutencao', 'vendido']
const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponível', alugado: 'Alugado', manutencao: 'Manutenção', vendido: 'Vendido'
}

const EMPTY: Partial<Item> = {
  name: '', category_id: '', description: '', size: '', color: '', brand: '',
  rental_price: 0, sale_price: undefined, status: 'disponivel',
  photo_url: '', purchase_price: undefined, notes: ''
}

export default function EstoqueClient({ items: initial, categories }: Props) {
  const [items, setItems] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [filterCat, setFilterCat] = useState('todos')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Item>>(EMPTY)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [viewItem, setViewItem] = useState<Item | null>(null)

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.brand || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || i.status === filterStatus
    const matchCat = filterCat === 'todos' || i.category_id === filterCat
    return matchSearch && matchStatus && matchCat
  })

  function openNew() { setEditing(EMPTY); setIsEdit(false); setModal(true) }
  function openEdit(item: Item) { setEditing({ ...item }); setIsEdit(true); setModal(true) }

  async function save() {
    setSaving(true)
    const payload = {
      name: editing.name,
      category_id: editing.category_id || null,
      description: editing.description || null,
      size: editing.size || null,
      color: editing.color || null,
      brand: editing.brand || null,
      rental_price: Number(editing.rental_price) || 0,
      sale_price: editing.sale_price ? Number(editing.sale_price) : null,
      status: editing.status || 'disponivel',
      photo_url: editing.photo_url || null,
      purchase_price: editing.purchase_price ? Number(editing.purchase_price) : null,
      notes: editing.notes || null,
    }

    if (isEdit && editing.id) {
      const { data } = await supabase.from('items').update(payload).eq('id', editing.id).select('*, categories(name)').single()
      if (data) setItems(prev => prev.map(i => i.id === data.id ? data : i))
    } else {
      const { data } = await supabase.from('items').insert(payload).select('*, categories(name)').single()
      if (data) setItems(prev => [...prev, data])
    }
    setSaving(false)
    setModal(false)
  }

  async function remove(id: string) {
    if (!confirm('Remover esta peça do estoque?')) return
    await supabase.from('items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const counts: Record<string, number> = {
    todos: items.length,
    disponivel: items.filter(i => i.status === 'disponivel').length,
    alugado: items.filter(i => i.status === 'alugado').length,
    manutencao: items.filter(i => i.status === 'manutencao').length,
    vendido: items.filter(i => i.status === 'vendido').length,
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Estoque</h1>
          <p style={{ color: 'var(--sf-gray)' }}>{items.length} peças cadastradas</p>
        </div>
        <button onClick={openNew} className="sf-btn-primary flex items-center gap-2">
          <Plus size={16} /> Nova Peça
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sf-gray)' }} />
          <input className="sf-input pl-9" placeholder="Buscar por nome ou marca..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="sf-input w-auto" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="todos">Todas categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['todos', ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: filterStatus === s ? 'var(--sf-accent)' : 'rgba(255,255,255,0.06)',
              color: filterStatus === s ? 'white' : 'var(--sf-gray)',
            }}
          >
            {s === 'todos' ? 'Todos' : STATUS_LABELS[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--sf-gray)' }}>
          <Package size={48} className="mb-4 opacity-30" />
          <p>Nenhuma peça encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="sf-card overflow-hidden group cursor-pointer" onClick={() => setViewItem(item)}>
              <div className="aspect-[3/4] relative overflow-hidden" style={{ background: 'var(--sf-navy-dark)' }}>
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={32} style={{ color: 'var(--sf-gray)' }} />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`sf-badge badge-${item.status} text-xs`}>{STATUS_LABELS[item.status]}</span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <button onClick={e => { e.stopPropagation(); openEdit(item) }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); remove(item.id) }}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition-all" style={{ color: '#e74c3c' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{item.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--sf-gray)' }}>
                  {(item as Item & { categories?: { name: string } }).categories?.name || '—'}
                  {item.size ? ` • ${item.size}` : ''}
                </p>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--sf-accent)' }}>
                  R$ {Number(item.rental_price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setViewItem(null)}>
          <div className="sf-card max-w-md w-full p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{viewItem.name}</h3>
              <button onClick={() => setViewItem(null)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>
            {viewItem.photo_url && (
              <img src={viewItem.photo_url} alt={viewItem.name}
                className="w-full aspect-[3/4] object-cover rounded-xl mb-4" />
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['Categoria', (viewItem as Item & { categories?: { name: string } }).categories?.name || '—'],
                ['Tamanho', viewItem.size || '—'],
                ['Cor', viewItem.color || '—'],
                ['Marca', viewItem.brand || '—'],
                ['Aluguel', `R$ ${Number(viewItem.rental_price).toFixed(2)}`],
                ['Venda', viewItem.sale_price ? `R$ ${Number(viewItem.sale_price).toFixed(2)}` : '—'],
                ['Status', STATUS_LABELS[viewItem.status]],
              ].map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: 'var(--sf-gray)' }}>{k}: </span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            {viewItem.description && (
              <p className="mt-3 text-sm" style={{ color: 'var(--sf-gray)' }}>{viewItem.description}</p>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setViewItem(null); openEdit(viewItem) }} className="sf-btn-primary flex-1 flex items-center justify-center gap-2">
                <Edit2 size={14} /> Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="sf-card max-w-lg w-full p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{isEdit ? 'Editar Peça' : 'Nova Peça'}</h3>
              <button onClick={() => setModal(false)} style={{ color: 'var(--sf-gray)' }}><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Nome *</label>
                <input className="sf-input" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Categoria</label>
                <select className="sf-input" value={editing.category_id || ''} onChange={e => setEditing(p => ({ ...p, category_id: e.target.value }))}>
                  <option value="">Selecione...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Status</label>
                <select className="sf-input" value={editing.status || 'disponivel'} onChange={e => setEditing(p => ({ ...p, status: e.target.value as Item['status'] }))}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Tamanho</label>
                <input className="sf-input" value={editing.size || ''} onChange={e => setEditing(p => ({ ...p, size: e.target.value }))} placeholder="P, M, G, GG..." />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Cor</label>
                <input className="sf-input" value={editing.color || ''} onChange={e => setEditing(p => ({ ...p, color: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Marca</label>
                <input className="sf-input" value={editing.brand || ''} onChange={e => setEditing(p => ({ ...p, brand: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Preço Aluguel (R$) *</label>
                <input className="sf-input" type="number" step="0.01" value={editing.rental_price || ''} onChange={e => setEditing(p => ({ ...p, rental_price: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Preço Venda (R$)</label>
                <input className="sf-input" type="number" step="0.01" value={editing.sale_price || ''} onChange={e => setEditing(p => ({ ...p, sale_price: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Custo Aquisição (R$)</label>
                <input className="sf-input" type="number" step="0.01" value={editing.purchase_price || ''} onChange={e => setEditing(p => ({ ...p, purchase_price: parseFloat(e.target.value) }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>URL da Foto</label>
                <input className="sf-input" value={editing.photo_url || ''} onChange={e => setEditing(p => ({ ...p, photo_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Descrição</label>
                <textarea className="sf-input" rows={2} value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1" style={{ color: 'var(--sf-gray)' }}>Observações</label>
                <textarea className="sf-input" rows={2} value={editing.notes || ''} onChange={e => setEditing(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="sf-btn-secondary flex-1">Cancelar</button>
              <button onClick={save} disabled={saving || !editing.name} className="sf-btn-primary flex-1">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
