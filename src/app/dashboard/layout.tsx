import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/')

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--sf-navy)' }}>
      <Sidebar role={session.role} userName={session.full_name} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
