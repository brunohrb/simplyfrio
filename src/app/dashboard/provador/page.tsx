import { supabase } from '@/lib/supabase'
import ProvadorClient from './ProvadorClient'

export default async function ProvadorPage() {
  const { data: rawItems } = await supabase
    .from('items')
    .select('id, name, photo_url, size, color, categories(name)')
    .not('photo_url', 'is', null)
    .eq('status', 'disponivel')
    .order('name')

  const items = (rawItems || []).map((i: any) => ({
    ...i,
    categories: Array.isArray(i.categories) ? i.categories[0] || null : i.categories,
  }))

  return <ProvadorClient items={items || []} />
}
