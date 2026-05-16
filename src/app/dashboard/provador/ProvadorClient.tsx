'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, X, Shirt, RefreshCw, Download } from 'lucide-react'

interface Item {
  id: string
  name: string
  photo_url: string
  size?: string
  color?: string
  categories?: { name: string } | null
}

export default function ProvadorClient({ items }: { items: Item[] }) {
  const [customerPhoto, setCustomerPhoto] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [search, setSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [composited, setComposited] = useState<string | null>(null)
  const [compositing, setCompositing] = useState(false)

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.categories?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setCustomerPhoto(ev.target?.result as string)
      setComposited(null)
    }
    reader.readAsDataURL(file)
  }

  const tryOn = useCallback(async () => {
    if (!customerPhoto || !selectedItem) return
    setCompositing(true)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const personImg = new Image()
    const clothingImg = new Image()
    clothingImg.crossOrigin = 'anonymous'

    await new Promise<void>(resolve => {
      personImg.onload = () => resolve()
      personImg.src = customerPhoto
    })

    canvas.width = personImg.width
    canvas.height = personImg.height

    // Draw person
    ctx.drawImage(personImg, 0, 0)

    // Draw clothing overlay in center ~40% width, starting at ~15% from top
    await new Promise<void>(resolve => {
      clothingImg.onload = () => {
        const cW = canvas.width * 0.55
        const cH = (clothingImg.naturalHeight / clothingImg.naturalWidth) * cW
        const cX = (canvas.width - cW) / 2
        const cY = canvas.height * 0.15

        ctx.globalAlpha = 0.75
        ctx.drawImage(clothingImg, cX, cY, cW, cH)
        ctx.globalAlpha = 1

        // Overlay text
        ctx.fillStyle = 'rgba(26,39,68,0.7)'
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50)
        ctx.fillStyle = 'white'
        ctx.font = `bold ${Math.round(canvas.width * 0.025)}px Arial`
        ctx.textAlign = 'center'
        ctx.fillText(`Simply Frio — ${selectedItem!.name}`, canvas.width / 2, canvas.height - 18)

        resolve()
      }
      clothingImg.onerror = () => resolve()
      clothingImg.src = selectedItem!.photo_url
    })

    setComposited(canvas.toDataURL('image/jpeg', 0.92))
    setCompositing(false)
  }, [customerPhoto, selectedItem])

  function download() {
    if (!composited) return
    const a = document.createElement('a')
    a.href = composited
    a.download = `simplyfrio-look-${selectedItem?.name}.jpg`
    a.click()
  }

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Camera size={24} style={{ color: 'var(--sf-accent)' }} /> Provador Virtual
        </h1>
        <p style={{ color: 'var(--sf-gray)' }}>Veja como ficaria cada peça</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: upload + result */}
        <div className="flex flex-col gap-4">
          <div className="sf-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Upload size={16} style={{ color: 'var(--sf-accent)' }} /> Foto da Cliente
            </h2>

            {!customerPhoto ? (
              <button onClick={() => fileRef.current?.click()}
                className="w-full aspect-[3/4] rounded-xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
                style={{ border: '2px dashed rgba(255,255,255,0.12)', background: 'var(--sf-navy-dark)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--sf-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}>
                <Camera size={40} style={{ color: 'var(--sf-gray)' }} />
                <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Clique para enviar uma foto</p>
                <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>JPG, PNG — foto de corpo inteiro funciona melhor</p>
              </button>
            ) : (
              <div className="relative">
                <img src={composited || customerPhoto} alt="Cliente" className="w-full rounded-xl object-cover" />
                <button onClick={() => { setCustomerPhoto(null); setComposited(null) }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>
                  <X size={16} />
                </button>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {customerPhoto && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => fileRef.current?.click()} className="sf-btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <RefreshCw size={14} /> Trocar foto
                </button>
                {composited && (
                  <button onClick={download} className="sf-btn-primary flex items-center justify-center gap-2 text-sm px-4">
                    <Download size={14} /> Salvar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Try on button */}
          {customerPhoto && selectedItem && (
            <button onClick={tryOn} disabled={compositing}
              className="sf-btn-primary flex items-center justify-center gap-2 py-3"
              style={{ width: '100%', fontSize: '15px' }}>
              <Shirt size={18} />
              {compositing ? 'Processando...' : `Experimentar: ${selectedItem.name}`}
            </button>
          )}

          {!customerPhoto && (
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(74,144,217,0.08)', color: 'var(--sf-gray)', border: '1px solid rgba(74,144,217,0.15)' }}>
              💡 <strong className="text-white">Dica:</strong> Envie uma foto da cliente de corpo inteiro com fundo claro para o melhor resultado.
            </div>
          )}
        </div>

        {/* Right: item selector */}
        <div className="sf-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Shirt size={16} style={{ color: 'var(--sf-accent)' }} /> Escolher Peça
            {selectedItem && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,144,217,0.15)', color: 'var(--sf-accent)' }}>{selectedItem.name}</span>}
          </h2>

          <input className="sf-input mb-4" placeholder="Buscar peça..." value={search} onChange={e => setSearch(e.target.value)} />

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--sf-gray)' }}>
              <Camera size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Nenhuma peça com foto disponível.</p>
              <p className="text-xs mt-1">Adicione fotos nas peças do estoque.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {filtered.map(item => {
                const selected = selectedItem?.id === item.id
                return (
                  <button key={item.id}
                    onClick={() => { setSelectedItem(item); setComposited(null) }}
                    className="rounded-xl overflow-hidden transition-all text-left"
                    style={{ border: `2px solid ${selected ? 'var(--sf-accent)' : 'transparent'}`, transform: selected ? 'scale(1.03)' : 'scale(1)' }}>
                    <img src={item.photo_url} alt={item.name} className="w-full aspect-[3/4] object-cover" />
                    <div className="p-2" style={{ background: selected ? 'rgba(74,144,217,0.15)' : 'var(--sf-navy-dark)' }}>
                      <p className="text-xs font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--sf-gray)' }}>{item.categories?.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for compositing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
