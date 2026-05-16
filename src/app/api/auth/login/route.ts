import { NextRequest, NextResponse } from 'next/server'
import { validateLogin, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const user = await validateLogin(username, password)
  if (!user) {
    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
  }

  const token = await createToken(user)
  const response = NextResponse.json({ ok: true, role: user.role })
  response.cookies.set('sf_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
