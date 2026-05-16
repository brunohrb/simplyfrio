import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { supabase } from './supabase'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'simplyfrio-secret-2024'
)

export interface SessionUser {
  id: string
  username: string
  role: 'admin' | 'user'
  full_name: string
}

export async function createToken(user: SessionUser) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('sf_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function validateLogin(username: string, password: string) {
  const { data: user } = await supabase
    .from('system_users')
    .select('*')
    .eq('username', username)
    .single()

  if (!user) return null

  const bcrypt = await import('bcryptjs')
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return null

  return user as SessionUser
}
