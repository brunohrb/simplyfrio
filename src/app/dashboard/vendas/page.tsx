import { supabase } from '@/lib/supabase'
import VendasClient from './VendasClient'

export default async function VendasPage() {
  const [{ data: sales }, { data: customers }, { data: items }] = await Promise.all([
    supabase.from('sales').select('*, customers(full_name), sale_items(*, items(name, photo_url))').order('created_at', { ascending: false }),
    supabase.from('customers').select('id, full_name').order('full_name'),
    supabase.from('items').select('id, name, sale_price, rental_price, status, photo_url, size').not('sale_price', 'is', null).order('name'),
  ])

  return <VendasClient sales={sales || []} customers={customers || []} saleItems={items || []} />
}
