'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SnowflakeIcon } from '@/components/Snowflake'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/dashboard')
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--sf-navy)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 gap-8 px-12"
        style={{ background: 'var(--sf-navy-dark)' }}>
        <SnowflakeIcon size={120} className="text-blue-400 animate-spin-slow" />
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-widest text-white mb-2">SIMPLY FRIO</h1>
          <p className="text-lg tracking-wider" style={{ color: 'var(--sf-gray)' }}>Elegância em cada estação</p>
        </div>
        <div className="flex gap-8 mt-8">
          {['Aluguel', 'Estilo', 'Qualidade'].map(w => (
            <div key={w} className="text-center">
              <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: 'var(--sf-accent)' }} />
              <span className="text-sm" style={{ color: 'var(--sf-gray)' }}>{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center w-full lg:w-[440px] px-8">
        <div className="w-full max-w-sm animate-fadeIn">
          <div className="flex flex-col items-center mb-10">
            <div className="lg:hidden mb-4">
              <SnowflakeIcon size={60} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Bem-vinda de volta</h2>
            <p className="text-sm" style={{ color: 'var(--sf-gray)' }}>Acesse o sistema Simply Frio</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-gray)' }}>
                Usuário
              </label>
              <input
                className="sf-input"
                type="text"
                placeholder="admin ou user"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--sf-gray)' }}>
                Senha
              </label>
              <div className="relative">
                <input
                  className="sf-input pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--sf-gray)' }}
                  onClick={() => setShowPass(s => !s)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-center py-2 px-3 rounded-lg"
                style={{ background: 'rgba(231,76,60,0.1)', color: 'var(--sf-danger)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="sf-btn-primary mt-2 flex items-center justify-center gap-2"
              style={{ padding: '12px', width: '100%' }}
            >
              {loading ? (
                <span>Entrando...</span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
