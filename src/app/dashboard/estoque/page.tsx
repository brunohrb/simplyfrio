import { supabase } from '@/lib/supabase'
import EstoqueClient from './EstoqueClient'

export default async function EstoquePage() {
  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase.from('items').select('*, categories(name)').order('name'),
    supabase.from('categories').select('*').order('name'),
  ])

  return <EstoqueClient items={items || []} categories={categories || []} />
}
