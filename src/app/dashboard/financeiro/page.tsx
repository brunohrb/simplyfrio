import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import FinanceiroClient from './FinanceiroClient'

export default async function FinanceiroPage() {
  const session = await getSession()
  if (session?.role !== 'admin') redirect('/dashboard')

  const now = new Date()
  const year = now.getFullYear()
  const startOfYear = `${year}-01-01`

  const [{ data: payments }, { data: sales }, { data: rentals }] = await Promise.all([
    supabase.from('rental_payments').select('*, rentals(customer_id, customers(full_name))').gte('paid_at', startOfYear),
    supabase.from('sales').select('*').gte('sale_date', startOfYear),
    supabase.from('rentals').select('*, customers(full_name)').gte('rental_date', startOfYear),
  ])

  return <FinanceiroClient payments={payments || []} sales={sales || []} rentals={rentals || []} />
}
