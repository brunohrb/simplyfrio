import { supabase } from '@/lib/supabase'
import ClientesClient from './ClientesClient'

export default async function ClientesPage() {
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .order('full_name')

  return <ClientesClient customers={customers || []} />
}
