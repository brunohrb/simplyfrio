import { supabase } from '@/lib/supabase'
import AlugueisClient from './AlugueisClient'

export default async function AlugueisPage() {
  const [{ data: rentals }, { data: customers }, { data: items }] = await Promise.all([
    supabase.from('rentals').select('*, customers(full_name, whatsapp), rental_items(*, items(name, photo_url, rental_price))').order('created_at', { ascending: false }),
    supabase.from('customers').select('id, full_name, whatsapp, points').order('full_name'),
    supabase.from('items').select('id, name, rental_price, status, photo_url, size, color').eq('status', 'disponivel').order('name'),
  ])

  return <AlugueisClient rentals={rentals || []} customers={customers || []} availableItems={items || []} />
}
