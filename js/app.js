// ─────────────────────────────────────────────
// Simply Frio — Sistema de Gestão
// ─────────────────────────────────────────────

const SUPABASE_URL = 'https://hisbbtddpoxufvghxqtm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhpc2JidGRkcG94dWZ2Z2h4cXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDM0OTgsImV4cCI6MjA4Nzc3OTQ5OH0.r3VkLkBxeorkCYjB-y6WOchePdfRKsm5lWE1iSSYlrw'

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── SVG Icons ───────────────────────────────
const icons = {
  snowflake: `<svg class="snowflake-icon" width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="32" y1="4" x2="32" y2="60" stroke="#4a90d9" stroke-width="3" stroke-linecap="round"/><line x1="4" y1="32" x2="60" y2="32" stroke="#4a90d9" stroke-width="3" stroke-linecap="round"/><line x1="11" y1="11" x2="53" y2="53" stroke="#4a90d9" stroke-width="3" stroke-linecap="round"/><line x1="53" y1="11" x2="11" y2="53" stroke="#4a90d9" stroke-width="3" stroke-linecap="round"/><line x1="32" y1="12" x2="26" y2="18" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="12" x2="38" y2="18" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="52" x2="26" y2="46" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="52" x2="38" y2="46" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="32" x2="18" y2="26" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="32" x2="18" y2="38" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="52" y1="32" x2="46" y2="26" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><line x1="52" y1="32" x2="46" y2="38" stroke="#4a90d9" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="32" r="4" fill="#4a90d9"/></svg>`,
  dashboard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  package: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  tag: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`,
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  cart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  chart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
  camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  logout: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  plus: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  eye: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#f39c12" stroke="#f39c12" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  gift: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  msg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  upload: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--gray)"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  shirt: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
}

// ─── State ───────────────────────────────────
let currentUser = null
let currentPage = ''
let categories = []

// ─── Auth ────────────────────────────────────
function getSession() {
  try { return JSON.parse(localStorage.getItem('sf_user') || 'null') } catch { return null }
}
function setSession(u) { localStorage.setItem('sf_user', JSON.stringify(u)); currentUser = u }
function clearSession() { localStorage.removeItem('sf_user'); currentUser = null }

async function login(username, password) {
  const { data, error } = await db.from('system_users').select('*').eq('username', username).eq('password', password).single()
  if (error || !data) throw new Error('Usuário ou senha incorretos')
  return data
}

// ─── Toast ───────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.className = `show ${type}`
  clearTimeout(t._timer)
  t._timer = setTimeout(() => { t.className = '' }, 3000)
}

// ─── Modal helpers ───────────────────────────
function openModal(id) {
  const el = document.getElementById(id)
  if (el) el.classList.add('open')
}
function closeModal(id) {
  const el = document.getElementById(id)
  if (el) el.classList.remove('open')
}

// ─── Sidebar / Navigation ────────────────────
function buildSidebar() {
  const navItems = [
    { page: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { page: 'estoque',   icon: icons.package,   label: 'Estoque' },
    { page: 'alugueis',  icon: icons.tag,       label: 'Aluguéis' },
    { page: 'clientes',  icon: icons.users,     label: 'Clientes' },
    { page: 'vendas',    icon: icons.cart,      label: 'Vendas' },
    ...(currentUser.role === 'admin' ? [{ page: 'financeiro', icon: icons.chart, label: 'Financeiro' }] : []),
    { page: 'provador',  icon: icons.camera,    label: 'Provador Virtual' },
  ]

  document.getElementById('sidebar-logo').innerHTML = `
    ${icons.snowflake}
    <div>
      <div class="brand">SIMPLY FRIO</div>
      <div class="sub">Sistema de Gestão</div>
    </div>`

  document.getElementById('sidebar-nav').innerHTML = navItems.map(item => `
    <button class="nav-item ${currentPage === item.page ? 'active' : ''}" onclick="navigate('${item.page}')">
      ${item.icon} ${item.label}
    </button>`).join('')

  const initial = currentUser.full_name.charAt(0).toUpperCase()
  const roleLabel = currentUser.role === 'admin' ? 'Administradora' : 'Funcionária'
  document.getElementById('sidebar-user').innerHTML = `
    <div class="user-info">
      <div class="user-avatar">${initial}</div>
      <div>
        <div class="user-name">${currentUser.full_name}</div>
        <div class="user-role">${roleLabel}</div>
      </div>
    </div>
    <button class="btn-logout" onclick="logout()">
      ${icons.logout} Sair
    </button>`
}

function navigate(page) {
  currentPage = page
  buildSidebar()
  const content = document.getElementById('page-content')
  // Mobile top bar
  const initial = currentUser.full_name.charAt(0).toUpperCase()
  const mobileBar = `<div class="mobile-topbar" style="display:none">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px">${initial}</div>
      <span style="font-size:13px;font-weight:600">Simply Frio</span>
    </div>
    <button class="btn-icon" onclick="logout()" title="Sair">${icons.logout}</button>
  </div>`
  content.innerHTML = mobileBar + '<div class="empty"><p>Carregando...</p></div>'
  applyMobileTopbar()
  pages[page]?.()
}

function applyMobileTopbar() {
  const bar = document.querySelector('.mobile-topbar')
  if(bar) bar.style.display = window.innerWidth <= 768 ? 'flex' : 'none'
  if(bar && bar.style.display !== 'none') {
    bar.style.cssText += ';justify-content:space-between;align-items:center;padding:10px 12px 4px;margin-bottom:8px;'
  }
}

function logout() {
  clearSession()
  document.getElementById('app-screen').style.display = 'none'
  document.getElementById('login-screen').style.display = 'flex'
  document.getElementById('login-user').value = ''
  document.getElementById('login-pass').value = ''
}

// ─── Formatting helpers ───────────────────────
const BRL = v => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',')
const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—'

const STATUS_ITEM = { disponivel: 'Disponível', alugado: 'Alugado', manutencao: 'Manutenção', vendido: 'Vendido' }
const STATUS_RENT = { ativo: 'Ativo', devolvido: 'Devolvido', atrasado: 'Atrasado', cancelado: 'Cancelado' }
const PAY_LABELS  = { dinheiro: 'Dinheiro', pix: 'PIX', cartao_credito: 'Cartão Crédito', cartao_debito: 'Cartão Débito', outro: 'Outro' }
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function badge(cls, label) { return `<span class="badge badge-${cls}">${label}</span>` }

// ─────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────
async function pageDashboard() {
  const isAdmin = currentUser.role === 'admin'
  const [
    { data: items },
    { data: rentals },
    { data: customers, count: custCount },
    { data: payments },
    { data: sales },
  ] = await Promise.all([
    db.from('items').select('status'),
    db.from('rentals').select('*, customers(full_name, whatsapp)').order('created_at', { ascending: false }),
    db.from('customers').select('id', { count: 'exact' }),
    db.from('rental_payments').select('amount, paid_at'),
    db.from('sales').select('total_amount, sale_date'),
  ])

  const now = new Date()
  const mStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`
  const available = (items||[]).filter(i=>i.status==='disponivel').length
  const rented    = (items||[]).filter(i=>i.status==='alugado').length
  const active    = (rentals||[]).filter(r=>r.status==='ativo')
  const overdue   = (rentals||[]).filter(r=>r.status==='atrasado').length
  const monthPay  = (payments||[]).filter(p=>p.paid_at>=mStart).reduce((s,p)=>s+Number(p.amount),0)
  const monthSale = (sales||[]).filter(s=>s.sale_date>=mStart).reduce((s,x)=>s+Number(x.total_amount),0)
  const pending   = active.reduce((s,r)=>s+Number(r.balance_due||0),0)

  const recentRentals = (rentals||[]).slice(0,5)

  // birthdays this month
  const curMonth = String(now.getMonth()+1).padStart(2,'0')
  const { data: birthdays } = await db.from('customers')
    .select('full_name, birthday, whatsapp')
    .not('birthday','is',null)
    .like('birthday', `%-${curMonth}-%`)

  const statsCards = [
    { label:'Total no Estoque', value:(items||[]).length, sub:`${available} disponíveis`, color:'#4a90d9', icon: icons.package },
    { label:'Aluguéis Ativos',  value:active.length,     sub:`${rented} peças alugadas`, color:'#2ecc71', icon: icons.tag },
    { label:'Total Clientes',   value:custCount||0,      sub:'cadastradas',              color:'#9b59b6', icon: icons.users },
    ...(isAdmin ? [
      { label:'Receita do Mês', value:BRL(monthPay+monthSale), sub:'aluguéis + vendas', color:'#2ecc71', icon: icons.chart },
      { label:'Saldo a Receber',value:BRL(pending),     sub:'na devolução',            color:'#f39c12', icon: icons.tag },
      { label:'Atrasados',      value:overdue,           sub:'aguardando devolução',    color:'#e74c3c', icon: icons.alert },
    ] : []),
  ]

  document.getElementById('page-content').innerHTML = `
    <div class="page-header"><div><h1>Dashboard</h1><p>Visão geral do negócio</p></div></div>
    <div class="stats-grid">
      ${statsCards.map(c=>`
        <div class="stat-card">
          <div class="stat-icon" style="background:${c.color}20">${c.icon.replace('width="16" height="16"','width="20" height="20"').replace('stroke="currentColor"',`stroke="${c.color}"`)}</div>
          <div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value">${c.value}</div>
            <div class="stat-sub">${c.sub}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="dash-grid">
      <div class="card" style="padding:20px">
        <div class="section-title">${icons.tag.replace('width="16"','width="15"').replace('height="16"','height="15"')} Últimos Aluguéis</div>
        ${recentRentals.length === 0 ? '<p style="color:var(--gray);font-size:13px">Nenhum aluguel registrado.</p>' :
          recentRentals.map(r=>`
            <div class="dash-row">
              <div>
                <div class="dash-name">${r.customers?.full_name||'—'}</div>
                <div class="dash-sub">${fmtDate(r.rental_date)}</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:13px;font-weight:600">${BRL(r.total_amount)}</div>
                ${badge(r.status, STATUS_RENT[r.status]||r.status)}
              </div>
            </div>`).join('')}
      </div>
      <div class="card" style="padding:20px">
        <div class="section-title" style="color:var(--warning)">🎂 Aniversariantes do Mês</div>
        ${(birthdays||[]).length === 0 ? '<p style="color:var(--gray);font-size:13px">Nenhum aniversariante este mês.</p>' :
          (birthdays||[]).slice(0,6).map(c=>`
            <div class="dash-row">
              <div>
                <div class="dash-name">${c.full_name}</div>
                <div class="dash-sub">${fmtDate(c.birthday)}</div>
              </div>
              ${c.whatsapp ? `<a class="btn-whatsapp" href="https://wa.me/55${c.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá ${c.full_name.split(' ')[0]}! 🎉❄️ A Simply Frio deseja a você um feliz aniversário! Como presente, temos um cupom especial: *ANIVER10* 🎁`)}" target="_blank">${icons.msg} WhatsApp</a>` : ''}
            </div>`).join('')}
      </div>
    </div>`
}

// ─────────────────────────────────────────────
// PAGE: ESTOQUE
// ─────────────────────────────────────────────
let estoque = { items:[], cats:[], filter:'todos', search:'', editingItem:null }

async function pageEstoque() {
  const [{ data: items }, { data: cats }] = await Promise.all([
    db.from('items').select('*, categories(name)').order('name'),
    db.from('categories').select('*').order('name'),
  ])
  estoque.items = items || []
  estoque.cats  = cats  || []
  categories    = cats  || []
  renderEstoque()
}

function renderEstoque() {
  const { items, cats, filter, search } = estoque
  const filtered = items.filter(i => {
    const matchS = i.name.toLowerCase().includes(search.toLowerCase()) || (i.brand||'').toLowerCase().includes(search.toLowerCase())
    const matchF = filter === 'todos' || i.status === filter
    return matchS && matchF
  })
  const counts = { todos:items.length, disponivel:0, alugado:0, manutencao:0, vendido:0 }
  items.forEach(i => { if(counts[i.status]!==undefined) counts[i.status]++ })
  const statuses = ['todos','disponivel','alugado','manutencao','vendido']
  const sLabels  = { todos:'Todos', ...STATUS_ITEM }

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div><h1>Estoque</h1><p>${items.length} peças cadastradas</p></div>
      <button class="btn-primary" onclick="openItemModal()">${icons.plus} Nova Peça</button>
    </div>
    <div class="filter-bar">
      <div class="search-wrap">${icons.search}<input class="sf-input" placeholder="Buscar nome ou marca..." oninput="estoque.search=this.value;renderEstoque()" value="${search}"></div>
      <div class="tab-pills">
        ${statuses.map(s=>`<button class="tab-pill ${filter===s?'active':''}" onclick="estoque.filter='${s}';renderEstoque()">${sLabels[s]} (${counts[s]})</button>`).join('')}
      </div>
    </div>
    ${filtered.length === 0
      ? `<div class="empty">${icons.package.replace('width="16" height="16"','width="48" height="48"')}<p>Nenhuma peça encontrada</p></div>`
      : `<div class="item-grid">${filtered.map(item => `
          <div class="item-card" onclick="viewItem('${item.id}')">
            <div class="item-thumb">
              ${item.photo_url ? `<img src="${item.photo_url}" alt="${item.name}" loading="lazy">` : `<div class="no-photo">${icons.camera.replace('width="16" height="16"','width="32" height="32"')}</div>`}
              ${badge(item.status, STATUS_ITEM[item.status])}
              <div class="item-actions">
                <button class="btn-primary" style="padding:6px 10px;font-size:12px" onclick="event.stopPropagation();openItemModal('${item.id}')">${icons.edit}</button>
                <button class="btn-secondary" style="padding:6px 10px;font-size:12px;color:#e74c3c;border-color:#e74c3c" onclick="event.stopPropagation();deleteItem('${item.id}')">${icons.trash}</button>
              </div>
            </div>
            <div class="item-body">
              <div class="item-name">${item.name}</div>
              <div class="item-meta">${item.categories?.name||'—'}${item.size?' • '+item.size:''}</div>
              <div class="item-price">${BRL(item.rental_price)}</div>
            </div>
          </div>`).join('')}</div>`}

    <!-- Item view modal -->
    <div class="modal-overlay" id="modal-view-item" onclick="if(event.target===this)closeModal('modal-view-item')">
      <div class="modal" id="modal-view-item-body"></div>
    </div>

    <!-- Item edit modal -->
    <div class="modal-overlay" id="modal-edit-item" onclick="if(event.target===this)closeModal('modal-edit-item')">
      <div class="modal">
        <div class="modal-header">
          <h3 id="item-modal-title">Nova Peça</h3>
          <button class="btn-icon" onclick="closeModal('modal-edit-item')">${icons.x}</button>
        </div>
        <form id="form-item" onsubmit="saveItem(event)">
          <div class="form-grid cols-2">
            <div class="form-group full"><label class="form-label">Nome *</label><input class="sf-input" name="name" required></div>
            <div class="form-group">
              <label class="form-label">Categoria</label>
              <select class="sf-input" name="category_id">
                <option value="">Selecione...</option>
                ${cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="sf-input" name="status">
                ${Object.entries(STATUS_ITEM).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Tamanho</label><input class="sf-input" name="size" placeholder="P, M, G, GG..."></div>
            <div class="form-group"><label class="form-label">Cor</label><input class="sf-input" name="color"></div>
            <div class="form-group"><label class="form-label">Marca</label><input class="sf-input" name="brand"></div>
            <div class="form-group"><label class="form-label">Preço Aluguel (R$) *</label><input class="sf-input" name="rental_price" type="number" step="0.01" required></div>
            <div class="form-group"><label class="form-label">Preço Venda (R$)</label><input class="sf-input" name="sale_price" type="number" step="0.01"></div>
            <div class="form-group"><label class="form-label">Custo de Aquisição (R$)</label><input class="sf-input" name="purchase_price" type="number" step="0.01"></div>
            <div class="form-group full"><label class="form-label">URL da Foto</label><input class="sf-input" name="photo_url" placeholder="https://..."></div>
            <div class="form-group full"><label class="form-label">Descrição</label><textarea class="sf-input" name="description" rows="2"></textarea></div>
            <div class="form-group full"><label class="form-label">Observações</label><textarea class="sf-input" name="notes" rows="2"></textarea></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" onclick="closeModal('modal-edit-item')">Cancelar</button>
            <button type="submit" class="btn-primary" id="btn-save-item">Salvar</button>
          </div>
        </form>
      </div>
    </div>`
}

function viewItem(id) {
  const item = estoque.items.find(i=>i.id===id)
  if(!item) return
  document.getElementById('modal-view-item-body').innerHTML = `
    <div class="modal-header">
      <h3>${item.name}</h3>
      <button class="btn-icon" onclick="closeModal('modal-view-item')">${icons.x}</button>
    </div>
    ${item.photo_url ? `<img src="${item.photo_url}" style="width:100%;border-radius:10px;margin-bottom:16px;aspect-ratio:3/4;object-fit:cover">` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;margin-bottom:16px">
      ${[['Categoria',item.categories?.name||'—'],['Tamanho',item.size||'—'],['Cor',item.color||'—'],['Marca',item.brand||'—'],['Aluguel',BRL(item.rental_price)],['Venda',item.sale_price?BRL(item.sale_price):'—'],['Status',STATUS_ITEM[item.status]||item.status]].map(([k,v])=>`<div><span style="color:var(--gray)">${k}: </span><span>${v}</span></div>`).join('')}
    </div>
    ${item.description?`<p style="color:var(--gray);font-size:13px;margin-bottom:16px">${item.description}</p>`:''}
    <button class="btn-primary" style="width:100%;justify-content:center" onclick="closeModal('modal-view-item');openItemModal('${item.id}')">${icons.edit} Editar</button>`
  openModal('modal-view-item')
}

function openItemModal(id) {
  const item = id ? estoque.items.find(i=>i.id===id) : null
  estoque.editingItem = item
  document.getElementById('item-modal-title').textContent = item ? 'Editar Peça' : 'Nova Peça'
  const form = document.getElementById('form-item')
  form.reset()
  if(item) {
    const fields = ['name','category_id','status','size','color','brand','rental_price','sale_price','purchase_price','photo_url','description','notes']
    fields.forEach(f => { if(form[f] && item[f]!=null) form[f].value = item[f] })
  }
  openModal('modal-edit-item')
}

async function saveItem(e) {
  e.preventDefault()
  const form = e.target
  const btn = document.getElementById('btn-save-item')
  btn.disabled = true; btn.textContent = 'Salvando...'
  const payload = {
    name: form.name.value,
    category_id: form.category_id.value || null,
    status: form.status.value,
    size: form.size.value || null,
    color: form.color.value || null,
    brand: form.brand.value || null,
    rental_price: parseFloat(form.rental_price.value) || 0,
    sale_price: form.sale_price.value ? parseFloat(form.sale_price.value) : null,
    purchase_price: form.purchase_price.value ? parseFloat(form.purchase_price.value) : null,
    photo_url: form.photo_url.value || null,
    description: form.description.value || null,
    notes: form.notes.value || null,
  }
  try {
    if(estoque.editingItem) {
      await db.from('items').update(payload).eq('id', estoque.editingItem.id)
    } else {
      await db.from('items').insert(payload)
    }
    toast(estoque.editingItem ? 'Peça atualizada!' : 'Peça cadastrada!')
    closeModal('modal-edit-item')
    pageEstoque()
  } catch(err) { toast('Erro ao salvar', 'error') }
  finally { btn.disabled = false; btn.textContent = 'Salvar' }
}

async function deleteItem(id) {
  if(!confirm('Remover esta peça do estoque?')) return
  await db.from('items').delete().eq('id', id)
  estoque.items = estoque.items.filter(i=>i.id!==id)
  renderEstoque()
  toast('Peça removida')
}

// ─────────────────────────────────────────────
// PAGE: CLIENTES
// ─────────────────────────────────────────────
let clientes = { list:[], search:'', editing:null }

async function pageClientes() {
  const { data } = await db.from('customers').select('*').order('full_name')
  clientes.list = data || []
  renderClientes()
}

function renderClientes() {
  const { list, search } = clientes
  const filtered = list.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.whatsapp||'').includes(search) || (c.phone||'').includes(search)
  )
  const now = new Date()

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div><h1>Clientes</h1><p>${list.length} cadastradas</p></div>
      <button class="btn-primary" onclick="openClienteModal()">${icons.plus} Nova Cliente</button>
    </div>
    <div class="filter-bar">
      <div class="search-wrap">${icons.search}<input class="sf-input" placeholder="Buscar por nome ou telefone..." oninput="clientes.search=this.value;renderClientes()" value="${search}"></div>
    </div>
    ${filtered.length === 0 ? `<div class="empty">${icons.users.replace('width="16" height="16"','width="48" height="48"')}<p>Nenhuma cliente encontrada</p></div>` : `
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Nome</th><th>WhatsApp</th><th>Aniversário</th><th>Pontos</th><th>Ações</th></tr></thead>
        <tbody>
          ${filtered.map(c => {
            const bday = c.birthday ? new Date(c.birthday+'T12:00:00') : null
            const isToday = bday && bday.getDate()===now.getDate() && bday.getMonth()===now.getMonth()
            const isMonth = bday && bday.getMonth()===now.getMonth()
            return `<tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:34px;height:34px;border-radius:50%;background:rgba(74,144,217,.15);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${c.full_name.charAt(0)}</div>
                  <div>
                    <div style="font-weight:600">${c.full_name} ${isToday?'🎂':isMonth?'🎉':''}</div>
                    ${c.email?`<div style="font-size:11px;color:var(--gray)">${c.email}</div>`:''}
                  </div>
                </div>
              </td>
              <td style="color:var(--gray)">${c.whatsapp||c.phone||'—'}</td>
              <td style="color:var(--gray)">${fmtDate(c.birthday)}</td>
              <td><div style="display:flex;align-items:center;gap:4px">${icons.star} <span style="font-weight:600">${c.points||0}</span></div></td>
              <td>
                <div style="display:flex;gap:4px;align-items:center">
                  <button class="btn-icon" onclick="openClienteModal('${c.id}')" title="Editar">${icons.edit}</button>
                  ${c.whatsapp?`<a class="btn-whatsapp" style="padding:4px 8px" href="https://wa.me/55${c.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá ${c.full_name.split(' ')[0]}! 😊❄️ Mensagem da Simply Frio.`)}" target="_blank">${icons.msg}</a>`:''}
                  <button class="btn-icon warning" onclick="sendBirthdayMsg('${c.id}')" title="Mensagem Aniversário">${icons.gift}</button>
                </div>
              </td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>`}

    <!-- Edit modal -->
    <div class="modal-overlay" id="modal-cliente" onclick="if(event.target===this)closeModal('modal-cliente')">
      <div class="modal">
        <div class="modal-header">
          <h3 id="cliente-modal-title">Nova Cliente</h3>
          <button class="btn-icon" onclick="closeModal('modal-cliente')">${icons.x}</button>
        </div>
        <form id="form-cliente" onsubmit="saveCliente(event)">
          <div class="form-grid cols-2">
            <div class="form-group full"><label class="form-label">Nome Completo *</label><input class="sf-input" name="full_name" required></div>
            <div class="form-group"><label class="form-label">Telefone</label><input class="sf-input" name="phone" placeholder="(11) 99999-9999"></div>
            <div class="form-group"><label class="form-label">WhatsApp</label><input class="sf-input" name="whatsapp" placeholder="(11) 99999-9999"></div>
            <div class="form-group"><label class="form-label">E-mail</label><input class="sf-input" name="email" type="email"></div>
            <div class="form-group"><label class="form-label">Data de Nascimento 🎂</label><input class="sf-input" name="birthday" type="date"></div>
            <div class="form-group"><label class="form-label">CPF</label><input class="sf-input" name="cpf" placeholder="000.000.000-00"></div>
            <div class="form-group full"><label class="form-label">Endereço</label><input class="sf-input" name="address"></div>
            <div class="form-group full"><label class="form-label">Observações</label><textarea class="sf-input" name="notes" rows="2"></textarea></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" onclick="closeModal('modal-cliente')">Cancelar</button>
            <button type="submit" class="btn-primary" id="btn-save-cliente">Salvar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Birthday modal -->
    <div class="modal-overlay" id="modal-bday" onclick="if(event.target===this)closeModal('modal-bday')">
      <div class="modal" id="modal-bday-body"></div>
    </div>`
}

function openClienteModal(id) {
  const c = id ? clientes.list.find(x=>x.id===id) : null
  clientes.editing = c
  document.getElementById('cliente-modal-title').textContent = c ? 'Editar Cliente' : 'Nova Cliente'
  const form = document.getElementById('form-cliente')
  form.reset()
  if(c) {
    ['full_name','phone','whatsapp','email','birthday','cpf','address','notes'].forEach(f=>{
      if(form[f] && c[f]!=null) form[f].value = c[f]
    })
  }
  openModal('modal-cliente')
}

async function saveCliente(e) {
  e.preventDefault()
  const form = e.target
  const btn = document.getElementById('btn-save-cliente')
  btn.disabled = true; btn.textContent = 'Salvando...'
  const payload = {
    full_name: form.full_name.value,
    phone: form.phone.value || null,
    whatsapp: form.whatsapp.value || null,
    email: form.email.value || null,
    birthday: form.birthday.value || null,
    cpf: form.cpf.value || null,
    address: form.address.value || null,
    notes: form.notes.value || null,
  }
  try {
    if(clientes.editing) {
      await db.from('customers').update(payload).eq('id', clientes.editing.id)
    } else {
      await db.from('customers').insert(payload)
    }
    toast(clientes.editing ? 'Cliente atualizada!' : 'Cliente cadastrada!')
    closeModal('modal-cliente')
    pageClientes()
  } catch { toast('Erro ao salvar', 'error') }
  finally { btn.disabled = false; btn.textContent = 'Salvar' }
}

function sendBirthdayMsg(id) {
  const c = clientes.list.find(x=>x.id===id)
  if(!c) return
  const msg = `Olá ${c.full_name.split(' ')[0]}! 🎉❄️ A Simply Frio deseja a você um feliz aniversário! Como presente especial, temos um cupom de 10% de desconto no seu próximo aluguel: *ANIVER10* 🎁 Muito obrigada pela sua preferência! 💙`
  document.getElementById('modal-bday-body').innerHTML = `
    <div class="modal-header"><h3>Mensagem de Aniversário</h3><button class="btn-icon" onclick="closeModal('modal-bday')">${icons.x}</button></div>
    <div style="background:var(--navy-dark);border-radius:10px;padding:14px;margin-bottom:16px;font-size:13px;line-height:1.6">${msg}</div>
    ${c.whatsapp
      ? `<a class="btn-whatsapp" style="width:100%;justify-content:center;padding:10px;font-size:14px" href="https://wa.me/55${c.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}" target="_blank">${icons.msg} Enviar pelo WhatsApp</a>`
      : `<p style="color:var(--gray);text-align:center;font-size:13px">WhatsApp não cadastrado para esta cliente.</p>`}`
  openModal('modal-bday')
}

// ─────────────────────────────────────────────
// PAGE: ALUGUÉIS
// ─────────────────────────────────────────────
let alugueis = { list:[], filter:'todos', search:'', customers:[], availItems:[], selItems:[] }

async function pageAlugueis() {
  const [{ data: rentals }, { data: customers }, { data: items }] = await Promise.all([
    db.from('rentals').select('*, customers(full_name, whatsapp), rental_items(*, items(name, photo_url, rental_price))').order('created_at', { ascending: false }),
    db.from('customers').select('id, full_name, whatsapp').order('full_name'),
    db.from('items').select('id, name, rental_price, photo_url, size, color, status').eq('status','disponivel').order('name'),
  ])
  alugueis.list      = rentals   || []
  alugueis.customers = customers || []
  alugueis.availItems= items     || []
  alugueis.selItems  = []
  renderAlugueis()
}

function renderAlugueis() {
  const { list, filter, search } = alugueis
  const filtered = list.filter(r => {
    const name = (r.customers?.full_name||'').toLowerCase()
    return name.includes(search.toLowerCase()) && (filter==='todos' || r.status===filter)
  })

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div><h1>Aluguéis</h1><p>${list.filter(r=>r.status==='ativo').length} ativos · ${list.filter(r=>r.status==='atrasado').length} atrasados</p></div>
      <button class="btn-primary" onclick="openNovoAluguel()">${icons.plus} Novo Aluguel</button>
    </div>
    <div class="filter-bar">
      <div class="search-wrap">${icons.search}<input class="sf-input" placeholder="Buscar por cliente..." oninput="alugueis.search=this.value;renderAlugueis()" value="${search}"></div>
      <div class="tab-pills">
        ${['todos','ativo','devolvido','atrasado','cancelado'].map(s=>`
          <button class="tab-pill ${filter===s?'active':''}" onclick="alugueis.filter='${s}';renderAlugueis()">
            ${s==='todos'?'Todos':STATUS_RENT[s]} (${s==='todos'?list.length:list.filter(r=>r.status===s).length})
          </button>`).join('')}
      </div>
    </div>
    ${filtered.length===0 ? `<div class="empty">${icons.tag.replace('width="16" height="16"','width="48" height="48"')}<p>Nenhum aluguel encontrado</p></div>` : `
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Cliente</th><th>Data</th><th>Devolução Prev.</th><th>Total</th><th>Depósito</th><th>Saldo</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          ${filtered.map(r => `<tr>
            <td style="font-weight:600">${r.customers?.full_name||'—'}</td>
            <td style="color:var(--gray)">${fmtDate(r.rental_date)}</td>
            <td style="color:var(--gray)">${fmtDate(r.expected_return)}</td>
            <td style="font-weight:600">${BRL(r.total_amount)}</td>
            <td style="color:#2ecc71">${BRL(r.deposit_paid)}</td>
            <td style="color:${Number(r.balance_due)>0?'#f39c12':'var(--gray)'};font-weight:600">${BRL(r.balance_due)}</td>
            <td>${badge(r.status, STATUS_RENT[r.status]||r.status)}</td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn-icon" onclick="viewAluguel('${r.id}')" title="Ver detalhes">${icons.eye}</button>
                ${r.status==='ativo'?`<button class="btn-icon success" onclick="openDevolucao('${r.id}')" title="Marcar devolvido">${icons.check}</button>`:''}
                ${r.status==='ativo'&&r.customers?.whatsapp?`<a class="btn-icon" style="color:#25D366" href="https://wa.me/55${r.customers.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá ${r.customers.full_name.split(' ')[0]}! 😊❄️ Lembrando que o saldo do seu aluguel Simply Frio é de *${BRL(r.balance_due)}* na devolução. Obrigada!`)}" target="_blank">${icons.msg}</a>`:''}
                ${r.status==='ativo'?`<button class="btn-icon warning" onclick="markAtrasado('${r.id}')" title="Marcar atrasado">${icons.alert}</button>`:''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}

    <!-- View modal -->
    <div class="modal-overlay" id="modal-view-aluguel" onclick="if(event.target===this)closeModal('modal-view-aluguel')">
      <div class="modal" id="modal-view-aluguel-body"></div>
    </div>

    <!-- Devolução modal -->
    <div class="modal-overlay" id="modal-devolucao" onclick="if(event.target===this)closeModal('modal-devolucao')">
      <div class="modal" id="modal-devolucao-body"></div>
    </div>

    <!-- Novo aluguel modal -->
    <div class="modal-overlay" id="modal-novo-aluguel" onclick="if(event.target===this)closeModal('modal-novo-aluguel')">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Novo Aluguel</h3>
          <button class="btn-icon" onclick="closeModal('modal-novo-aluguel')">${icons.x}</button>
        </div>
        <form id="form-aluguel" onsubmit="saveAluguel(event)">
          <div class="form-grid cols-2" style="margin-bottom:16px">
            <div class="form-group full">
              <label class="form-label">Cliente *</label>
              <select class="sf-input" name="customer_id" required>
                <option value="">Selecione a cliente...</option>
                ${alugueis.customers.map(c=>`<option value="${c.id}">${c.full_name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Data do Aluguel</label><input class="sf-input" name="rental_date" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group"><label class="form-label">Previsão de Devolução</label><input class="sf-input" name="expected_return" type="date"></div>
            <div class="form-group"><label class="form-label">Desconto (R$)</label><input class="sf-input" name="discount" type="number" step="0.01" value="0" oninput="updateAluguelSummary()"></div>
            <div class="form-group">
              <label class="form-label">Pagamento Depósito (50%)</label>
              <select class="sf-input" name="pay_method">
                ${Object.entries(PAY_LABELS).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
              </select>
            </div>
            <div class="form-group full"><label class="form-label">Observações</label><input class="sf-input" name="notes"></div>
          </div>
          <div class="form-label" style="margin-bottom:8px">Selecionar Peças *</div>
          <div class="item-selector" id="item-selector-aluguel">
            ${alugueis.availItems.length===0
              ? `<p style="color:var(--gray);font-size:13px;grid-column:1/-1">Nenhuma peça disponível no momento.</p>`
              : alugueis.availItems.map(i=>`
                <div class="item-sel-card" id="sel-${i.id}" onclick="toggleSelItem('${i.id}','aluguel')">
                  ${i.photo_url?`<img src="${i.photo_url}" loading="lazy">`:`<div class="no-img">${icons.camera}</div>`}
                  <div class="item-sel-info">
                    <div class="name">${i.name}</div>
                    <div class="price">${BRL(i.rental_price)}</div>
                  </div>
                </div>`).join('')}
          </div>
          <div class="rental-summary" id="aluguel-summary" style="display:none">
            <div class="rental-summary-row"><span style="color:var(--gray)">Subtotal</span><span id="aluguel-sub">R$ 0,00</span></div>
            <div class="rental-summary-row"><span style="color:var(--gray)">Desconto</span><span id="aluguel-desc" style="color:#e74c3c">- R$ 0,00</span></div>
            <div class="rental-summary-row total"><span>Total</span><span id="aluguel-total">R$ 0,00</span></div>
            <div class="rental-summary-row"><span style="color:var(--gray)">Depósito agora (50%)</span><span id="aluguel-dep" style="color:#2ecc71;font-weight:700">R$ 0,00</span></div>
            <div class="rental-summary-row"><span style="color:var(--gray)">Saldo na devolução (50%)</span><span id="aluguel-bal" style="color:#f39c12;font-weight:700">R$ 0,00</span></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" onclick="closeModal('modal-novo-aluguel')">Cancelar</button>
            <button type="submit" class="btn-primary" id="btn-save-aluguel">Registrar Aluguel</button>
          </div>
        </form>
      </div>
    </div>`
}

function toggleSelItem(id, ctx) {
  const arr = ctx === 'aluguel' ? alugueis.selItems : vendas.selItems
  const idx = arr.indexOf(id)
  if(idx >= 0) arr.splice(idx, 1)
  else arr.push(id)
  document.getElementById(`sel-${id}`)?.classList.toggle('selected', arr.includes(id))
  if(ctx === 'aluguel') updateAluguelSummary()
  else updateVendaSummary()
}

function updateAluguelSummary() {
  const form = document.getElementById('form-aluguel')
  if(!form) return
  const discount = parseFloat(form.discount?.value) || 0
  const sub = alugueis.availItems.filter(i=>alugueis.selItems.includes(i.id)).reduce((s,i)=>s+Number(i.rental_price),0)
  const total = Math.max(0, sub - discount)
  const dep = total * 0.5
  const summary = document.getElementById('aluguel-summary')
  if(summary) {
    summary.style.display = alugueis.selItems.length > 0 ? '' : 'none'
    document.getElementById('aluguel-sub').textContent = BRL(sub)
    document.getElementById('aluguel-desc').textContent = `- ${BRL(discount)}`
    document.getElementById('aluguel-total').textContent = BRL(total)
    document.getElementById('aluguel-dep').textContent = BRL(dep)
    document.getElementById('aluguel-bal').textContent = BRL(dep)
  }
}

function openNovoAluguel() {
  alugueis.selItems = []
  openModal('modal-novo-aluguel')
  setTimeout(() => {
    alugueis.availItems.forEach(i => document.getElementById(`sel-${i.id}`)?.classList.remove('selected'))
    updateAluguelSummary()
  }, 50)
}

async function saveAluguel(e) {
  e.preventDefault()
  if(alugueis.selItems.length === 0) { toast('Selecione pelo menos uma peça','error'); return }
  const form = e.target
  const btn = document.getElementById('btn-save-aluguel')
  btn.disabled = true; btn.textContent = 'Registrando...'
  const discount = parseFloat(form.discount.value) || 0
  const sub = alugueis.availItems.filter(i=>alugueis.selItems.includes(i.id)).reduce((s,i)=>s+Number(i.rental_price),0)
  const total = Math.max(0, sub - discount)
  const deposit = total * 0.5
  try {
    const { data: rental } = await db.from('rentals').insert({
      customer_id: form.customer_id.value,
      rental_date: form.rental_date.value,
      expected_return: form.expected_return.value || null,
      total_amount: total,
      deposit_paid: deposit,
      status: 'ativo',
      discount_amount: discount,
      notes: form.notes.value || null,
    }).select().single()
    await db.from('rental_items').insert(alugueis.selItems.map(id=>({
      rental_id: rental.id,
      item_id: id,
      rental_price: alugueis.availItems.find(i=>i.id===id)?.rental_price || 0,
    })))
    await db.from('items').update({ status:'alugado' }).in('id', alugueis.selItems)
    await db.from('rental_payments').insert({
      rental_id: rental.id,
      payment_type: 'deposito',
      amount: deposit,
      payment_method: form.pay_method.value,
    })
    const pts = Math.floor(total / 10)
    if(pts > 0) await db.from('point_history').insert({ customer_id: form.customer_id.value, points_delta: pts, reason: 'Aluguel realizado', reference_id: rental.id })
    toast('Aluguel registrado!')
    closeModal('modal-novo-aluguel')
    pageAlugueis()
  } catch(err) { toast('Erro ao registrar', 'error'); console.error(err) }
  finally { btn.disabled = false; btn.textContent = 'Registrar Aluguel' }
}

function viewAluguel(id) {
  const r = alugueis.list.find(x=>x.id===id)
  if(!r) return
  document.getElementById('modal-view-aluguel-body').innerHTML = `
    <div class="modal-header"><h3>Detalhes do Aluguel</h3><button class="btn-icon" onclick="closeModal('modal-view-aluguel')">${icons.x}</button></div>
    <div style="display:grid;gap:6px;font-size:13px;margin-bottom:14px">
      ${[['Cliente',r.customers?.full_name||'—'],['Data',fmtDate(r.rental_date)],['Devolução',fmtDate(r.expected_return)],['Status',STATUS_RENT[r.status]||r.status]].map(([k,v])=>`<div><span style="color:var(--gray)">${k}: </span><span style="font-weight:600">${v}</span></div>`).join('')}
    </div>
    <div class="rental-summary">
      <div class="rental-summary-row"><span style="color:var(--gray)">Total</span><span style="font-weight:700">${BRL(r.total_amount)}</span></div>
      <div class="rental-summary-row"><span style="color:var(--gray)">Depósito pago</span><span style="color:#2ecc71">${BRL(r.deposit_paid)}</span></div>
      <div class="rental-summary-row"><span style="color:var(--gray)">Saldo na devolução</span><span style="color:#f39c12;font-weight:700">${BRL(r.balance_due)}</span></div>
    </div>
    <div class="form-label" style="margin:12px 0 8px">Peças:</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${(r.rental_items||[]).map(ri=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--navy-dark);padding:8px;border-radius:8px">
          ${ri.items?.photo_url?`<img src="${ri.items.photo_url}" style="width:36px;height:42px;object-fit:cover;border-radius:5px">`:''}
          <span style="flex:1;font-size:13px">${ri.items?.name||'—'}</span>
          <span style="color:var(--accent);font-weight:600">${BRL(ri.rental_price)}</span>
        </div>`).join('')}
    </div>
    ${r.notes?`<p style="color:var(--gray);font-size:12px;margin-top:10px">Obs: ${r.notes}</p>`:''}`
  openModal('modal-view-aluguel')
}

function openDevolucao(id) {
  const r = alugueis.list.find(x=>x.id===id)
  if(!r) return
  document.getElementById('modal-devolucao-body').innerHTML = `
    <div class="modal-header"><h3>Confirmar Devolução</h3><button class="btn-icon" onclick="closeModal('modal-devolucao')">${icons.x}</button></div>
    <div class="rental-summary">
      <div class="rental-summary-row"><span style="color:var(--gray)">Cliente</span><span style="font-weight:600">${r.customers?.full_name||'—'}</span></div>
      <div class="rental-summary-row"><span style="color:var(--gray)">Saldo a receber</span><span style="color:#f39c12;font-weight:700;font-size:18px">${BRL(r.balance_due)}</span></div>
    </div>
    <div class="form-group" style="margin:14px 0">
      <label class="form-label">Forma de pagamento do saldo</label>
      <select class="sf-input" id="dev-pay-method">
        ${Object.entries(PAY_LABELS).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
      </select>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal('modal-devolucao')">Cancelar</button>
      <button class="btn-primary" onclick="confirmDevolucao('${r.id}')">${icons.check} Confirmar</button>
    </div>`
  openModal('modal-devolucao')
}

async function confirmDevolucao(id) {
  const r = alugueis.list.find(x=>x.id===id)
  const payMethod = document.getElementById('dev-pay-method')?.value || 'dinheiro'
  await db.from('rentals').update({ status:'devolvido', actual_return: new Date().toISOString().split('T')[0] }).eq('id', id)
  const itemIds = (r.rental_items||[]).map(ri=>ri.item_id)
  if(itemIds.length) await db.from('items').update({ status:'disponivel' }).in('id', itemIds)
  if(Number(r.balance_due) > 0) {
    await db.from('rental_payments').insert({ rental_id: id, payment_type:'saldo', amount: r.balance_due, payment_method: payMethod })
  }
  toast('Devolução confirmada!')
  closeModal('modal-devolucao')
  pageAlugueis()
}

async function markAtrasado(id) {
  await db.from('rentals').update({ status:'atrasado' }).eq('id', id)
  alugueis.list = alugueis.list.map(r=>r.id===id?{...r,status:'atrasado'}:r)
  renderAlugueis()
  toast('Marcado como atrasado', 'error')
}

// ─────────────────────────────────────────────
// PAGE: VENDAS
// ─────────────────────────────────────────────
let vendas = { list:[], search:'', customers:[], saleItems:[], selItems:[] }

async function pageVendas() {
  const [{ data: sales }, { data: customers }, { data: items }] = await Promise.all([
    db.from('sales').select('*, customers(full_name), sale_items(*, items(name, photo_url))').order('created_at', { ascending: false }),
    db.from('customers').select('id, full_name').order('full_name'),
    db.from('items').select('id, name, sale_price, photo_url, size, status').not('sale_price','is',null).order('name'),
  ])
  vendas.list      = sales     || []
  vendas.customers = customers || []
  vendas.saleItems = items     || []
  vendas.selItems  = []
  renderVendas()
}

function renderVendas() {
  const { list, search } = vendas
  const filtered = list.filter(s=>(s.customers?.full_name||'avulsa').toLowerCase().includes(search.toLowerCase()))

  document.getElementById('page-content').innerHTML = `
    <div class="page-header">
      <div><h1>Vendas</h1><p>Rotação de estoque</p></div>
      <button class="btn-primary" onclick="openNovaVenda()">${icons.plus} Nova Venda</button>
    </div>
    <div class="filter-bar">
      <div class="search-wrap">${icons.search}<input class="sf-input" placeholder="Buscar por cliente..." oninput="vendas.search=this.value;renderVendas()" value="${search}"></div>
    </div>
    ${filtered.length===0 ? `<div class="empty">${icons.cart.replace('width="16" height="16"','width="48" height="48"')}<p>Nenhuma venda registrada</p></div>` : `
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Data</th><th>Cliente</th><th>Total</th><th>Pagamento</th><th>Peças</th><th>Ações</th></tr></thead>
        <tbody>
          ${filtered.map(s=>`<tr>
            <td style="color:var(--gray)">${fmtDate(s.sale_date)}</td>
            <td style="font-weight:600">${s.customers?.full_name||'Venda Avulsa'}</td>
            <td style="font-weight:700;color:#2ecc71">${BRL(s.total_amount)}</td>
            <td style="color:var(--gray)">${PAY_LABELS[s.payment_method]||s.payment_method}</td>
            <td style="color:var(--gray)">${s.sale_items?.length||0} peça(s)</td>
            <td><button class="btn-icon" onclick="viewVenda('${s.id}')">${icons.eye}</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}

    <!-- View modal -->
    <div class="modal-overlay" id="modal-view-venda" onclick="if(event.target===this)closeModal('modal-view-venda')">
      <div class="modal" id="modal-view-venda-body"></div>
    </div>

    <!-- Nova venda modal -->
    <div class="modal-overlay" id="modal-nova-venda" onclick="if(event.target===this)closeModal('modal-nova-venda')">
      <div class="modal modal-lg">
        <div class="modal-header"><h3>Nova Venda</h3><button class="btn-icon" onclick="closeModal('modal-nova-venda')">${icons.x}</button></div>
        <form id="form-venda" onsubmit="saveVenda(event)">
          <div class="form-grid cols-2" style="margin-bottom:16px">
            <div class="form-group full">
              <label class="form-label">Cliente (opcional)</label>
              <select class="sf-input" name="customer_id">
                <option value="">Venda avulsa (sem cliente)</option>
                ${vendas.customers.map(c=>`<option value="${c.id}">${c.full_name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Forma de Pagamento</label>
              <select class="sf-input" name="pay_method">
                ${Object.entries(PAY_LABELS).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Desconto (R$)</label><input class="sf-input" name="discount" type="number" step="0.01" value="0" oninput="updateVendaSummary()"></div>
          </div>
          <div class="form-label" style="margin-bottom:8px">Selecionar Peças para Venda *</div>
          ${vendas.saleItems.length===0
            ? `<p style="color:var(--gray);font-size:13px">Nenhuma peça com preço de venda. Adicione preços no Estoque.</p>`
            : `<div class="item-selector" id="item-selector-venda">
                ${vendas.saleItems.map(i=>`
                  <div class="item-sel-card" id="sel-${i.id}" onclick="toggleSelItem('${i.id}','venda')">
                    ${i.photo_url?`<img src="${i.photo_url}" loading="lazy">`:`<div class="no-img">${icons.camera}</div>`}
                    <div class="item-sel-info">
                      <div class="name">${i.name}</div>
                      <div class="price" style="color:#2ecc71">${BRL(i.sale_price)}</div>
                    </div>
                  </div>`).join('')}
              </div>`}
          <div class="rental-summary" id="venda-summary" style="display:none">
            <div class="rental-summary-row total"><span>Total da Venda</span><span id="venda-total" style="color:#2ecc71">R$ 0,00</span></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" onclick="closeModal('modal-nova-venda')">Cancelar</button>
            <button type="submit" class="btn-primary" id="btn-save-venda">Confirmar Venda</button>
          </div>
        </form>
      </div>
    </div>`
}

function openNovaVenda() {
  vendas.selItems = []
  openModal('modal-nova-venda')
  setTimeout(()=>{
    vendas.saleItems.forEach(i=>document.getElementById(`sel-${i.id}`)?.classList.remove('selected'))
    updateVendaSummary()
  }, 50)
}

function updateVendaSummary() {
  const form = document.getElementById('form-venda')
  if(!form) return
  const discount = parseFloat(form.discount?.value) || 0
  const sub = vendas.saleItems.filter(i=>vendas.selItems.includes(i.id)).reduce((s,i)=>s+Number(i.sale_price),0)
  const total = Math.max(0, sub - discount)
  const summary = document.getElementById('venda-summary')
  if(summary) {
    summary.style.display = vendas.selItems.length > 0 ? '' : 'none'
    document.getElementById('venda-total').textContent = BRL(total)
  }
}

async function saveVenda(e) {
  e.preventDefault()
  if(vendas.selItems.length===0){ toast('Selecione pelo menos uma peça','error'); return }
  const form = e.target
  const btn = document.getElementById('btn-save-venda')
  btn.disabled = true; btn.textContent = 'Registrando...'
  const discount = parseFloat(form.discount.value) || 0
  const sub = vendas.saleItems.filter(i=>vendas.selItems.includes(i.id)).reduce((s,i)=>s+Number(i.sale_price),0)
  const total = Math.max(0, sub - discount)
  try {
    const { data: sale } = await db.from('sales').insert({
      customer_id: form.customer_id.value || null,
      sale_date: new Date().toISOString().split('T')[0],
      total_amount: total,
      payment_method: form.pay_method.value,
      discount_amount: discount,
    }).select().single()
    await db.from('sale_items').insert(vendas.selItems.map(id=>({
      sale_id: sale.id,
      item_id: id,
      sale_price: vendas.saleItems.find(i=>i.id===id)?.sale_price || 0,
    })))
    await db.from('items').update({ status:'vendido' }).in('id', vendas.selItems)
    if(form.customer_id.value) {
      const pts = Math.floor(total/10)
      if(pts>0) await db.from('point_history').insert({ customer_id: form.customer_id.value, points_delta: pts, reason:'Compra realizada', reference_id: sale.id })
    }
    toast('Venda registrada!')
    closeModal('modal-nova-venda')
    pageVendas()
  } catch(err) { toast('Erro ao registrar','error'); console.error(err) }
  finally { btn.disabled = false; btn.textContent = 'Confirmar Venda' }
}

function viewVenda(id) {
  const s = vendas.list.find(x=>x.id===id)
  if(!s) return
  document.getElementById('modal-view-venda-body').innerHTML = `
    <div class="modal-header"><h3>Detalhes da Venda</h3><button class="btn-icon" onclick="closeModal('modal-view-venda')">${icons.x}</button></div>
    <div style="display:grid;gap:6px;font-size:13px;margin-bottom:14px">
      ${[['Cliente',s.customers?.full_name||'Avulsa'],['Data',fmtDate(s.sale_date)],['Total',BRL(s.total_amount)],['Pagamento',PAY_LABELS[s.payment_method]||s.payment_method]].map(([k,v])=>`<div><span style="color:var(--gray)">${k}: </span><span style="font-weight:600">${v}</span></div>`).join('')}
    </div>
    <div class="form-label" style="margin-bottom:8px">Peças vendidas:</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${(s.sale_items||[]).map(si=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--navy-dark);padding:8px;border-radius:8px">
          ${si.items?.photo_url?`<img src="${si.items.photo_url}" style="width:36px;height:42px;object-fit:cover;border-radius:5px">`:''}
          <span style="flex:1;font-size:13px">${si.items?.name||'—'}</span>
          <span style="color:#2ecc71;font-weight:700">${BRL(si.sale_price)}</span>
        </div>`).join('')}
    </div>`
  openModal('modal-view-venda')
}

// ─────────────────────────────────────────────
// PAGE: FINANCEIRO (admin only)
// ─────────────────────────────────────────────
let finState = { selMonth: new Date().getMonth() }

async function pageFinanceiro() {
  if(currentUser.role !== 'admin') { navigate('dashboard'); return }
  const year = new Date().getFullYear()
  const [{ data: payments }, { data: sales }, { data: rentals }] = await Promise.all([
    db.from('rental_payments').select('*, rentals(customer_id, customers(full_name))').gte('paid_at', `${year}-01-01`),
    db.from('sales').select('*').gte('sale_date', `${year}-01-01`),
    db.from('rentals').select('*, customers(full_name)').gte('rental_date', `${year}-01-01`),
  ])
  const allPayments = payments || []
  const allSales    = sales    || []
  const allRentals  = rentals  || []

  const monthlyData = MONTHS.map((name, idx) => {
    const m = String(idx+1).padStart(2,'0')
    const rentRev  = allPayments.filter(p=>p.paid_at?.startsWith(`${year}-${m}`)).reduce((s,p)=>s+Number(p.amount),0)
    const saleRev  = allSales.filter(s=>s.sale_date?.startsWith(`${year}-${m}`)).reduce((s,x)=>s+Number(x.total_amount),0)
    return { name, alugueis: rentRev, vendas: saleRev, total: rentRev+saleRev }
  })

  const maxVal = Math.max(...monthlyData.map(d=>d.total), 1)
  const pending = allRentals.filter(r=>r.status==='ativo'||r.status==='atrasado').reduce((s,r)=>s+Number(r.balance_due||0),0)
  const totalYear = allPayments.reduce((s,p)=>s+Number(p.amount),0) + allSales.reduce((s,x)=>s+Number(x.total_amount),0)

  function renderMonthDetail(idx) {
    const m = String(idx+1).padStart(2,'0')
    const mPay   = allPayments.filter(p=>p.paid_at?.startsWith(`${year}-${m}`))
    const mSales = allSales.filter(s=>s.sale_date?.startsWith(`${year}-${m}`))
    const mRents = allRentals.filter(r=>r.rental_date?.startsWith(`${year}-${m}`))
    const rentRev = mPay.reduce((s,p)=>s+Number(p.amount),0)
    const saleRev = mSales.reduce((s,x)=>s+Number(x.total_amount),0)
    const payMethods = {}
    mPay.forEach(p=>{ payMethods[p.payment_method]=(payMethods[p.payment_method]||0)+Number(p.amount) })

    document.getElementById('fin-month-detail').innerHTML = `
      <div class="dash-grid" style="margin-top:20px">
        <div class="card" style="padding:20px">
          <div class="section-title">Resumo — ${MONTHS[idx]}</div>
          ${[['Total recebido',BRL(rentRev+saleRev),'white'],['De aluguéis',BRL(rentRev),'#4a90d9'],['De vendas',BRL(saleRev),'#9b59b6'],['Novos aluguéis',mRents.length+' aluguéis','var(--gray)']].map(([k,v,c])=>`
            <div class="dash-row"><span style="color:var(--gray)">${k}</span><span style="font-weight:700;color:${c}">${v}</span></div>`).join('')}
        </div>
        <div class="card" style="padding:20px">
          <div class="section-title">Formas de Pagamento</div>
          ${Object.keys(payMethods).length===0?'<p style="color:var(--gray);font-size:13px">Sem pagamentos neste mês.</p>':
            Object.entries(payMethods).sort((a,b)=>b[1]-a[1]).map(([method,total])=>{
              const pct = rentRev>0?Math.round((total/rentRev)*100):0
              return `<div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                  <span style="color:var(--gray)">${PAY_LABELS[method]||method}</span>
                  <span>${BRL(total)} (${pct}%)</span>
                </div>
                <div style="height:5px;background:rgba(255,255,255,.06);border-radius:3px"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px"></div></div>
              </div>`}).join('')}
        </div>
      </div>
      <div class="card" style="padding:20px;margin-top:16px">
        <div class="section-title">Pagamentos Recebidos — ${MONTHS[idx]}</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Valor</th><th>Método</th><th>Cliente</th></tr></thead>
          <tbody>
            ${mPay.length===0?`<tr><td colspan="5" style="color:var(--gray);text-align:center;padding:20px">Nenhum pagamento</td></tr>`:
              mPay.slice(0,20).map(p=>`<tr>
                <td style="color:var(--gray)">${fmtDate(p.paid_at?.split('T')[0])}</td>
                <td>${p.payment_type==='deposito'?'Depósito (50%)':p.payment_type==='saldo'?'Saldo devolução':p.payment_type}</td>
                <td style="color:#2ecc71;font-weight:600">${BRL(p.amount)}</td>
                <td style="color:var(--gray)">${PAY_LABELS[p.payment_method]||p.payment_method}</td>
                <td style="color:var(--gray)">${p.rentals?.customers?.full_name||'—'}</td>
              </tr>`).join('')}
          </tbody>
        </table></div>
      </div>`
  }

  document.getElementById('page-content').innerHTML = `
    <div class="page-header"><div><h1>Financeiro</h1><p>Visão financeira completa — ${year}</p></div></div>
    <div class="stats-grid">
      ${[
        { label:`Receita ${year}`, value:BRL(totalYear), sub:'total anual', color:'#2ecc71' },
        { label:'Saldo Pendente', value:BRL(pending), sub:'na devolução', color:'#f39c12' },
        { label:'Total Aluguéis', value:allRentals.length, sub:'no ano', color:'#4a90d9' },
        { label:'Total Vendas', value:allSales.length, sub:'no ano', color:'#9b59b6' },
      ].map(c=>`<div class="stat-card">
        <div class="stat-icon" style="background:${c.color}20">${icons.chart.replace('stroke="currentColor"',`stroke="${c.color}"`)}</div>
        <div><div class="stat-label">${c.label}</div><div class="stat-value">${c.value}</div><div class="stat-sub">${c.sub}</div></div>
      </div>`).join('')}
    </div>
    <!-- Bar chart manual -->
    <div class="card" style="padding:20px;margin-bottom:16px">
      <div class="section-title">Receita Mensal — ${year}</div>
      <div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding-top:10px">
        ${monthlyData.map((d,i)=>`
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer" onclick="finState.selMonth=${i};document.querySelectorAll('.month-bar').forEach((b,j)=>b.style.background=j===${i}?'var(--accent)':'rgba(74,144,217,0.35)');renderMonthDetailFin(${i})">
            <div class="month-bar" style="width:100%;height:${Math.max(4,Math.round((d.total/maxVal)*130))}px;background:${i===finState.selMonth?'var(--accent)':'rgba(74,144,217,0.35)'};border-radius:4px 4px 0 0;transition:background .18s" title="${BRL(d.total)}"></div>
            <div style="font-size:10px;color:var(--gray)">${d.name}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:14px;justify-content:center;margin-top:10px">
        <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--gray)"><div style="width:10px;height:10px;border-radius:2px;background:#4a90d9"></div>Aluguéis</div>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--gray)"><div style="width:10px;height:10px;border-radius:2px;background:#9b59b6"></div>Vendas</div>
      </div>
    </div>
    <div class="month-tabs">
      ${MONTHS.map((m,i)=>`<button class="tab-pill ${i===finState.selMonth?'active':''}" onclick="finState.selMonth=${i};document.querySelectorAll('.tab-pill').forEach((b,j)=>b.className='tab-pill'+(j===${i}?' active':''));renderMonthDetailFin(${i})">${m}</button>`).join('')}
    </div>
    <div id="fin-month-detail"></div>`

  window.renderMonthDetailFin = renderMonthDetail
  renderMonthDetail(finState.selMonth)
}

// ─────────────────────────────────────────────
// PAGE: PROVADOR VIRTUAL
// ─────────────────────────────────────────────
let provador = { items:[], selectedItem:null, customerPhoto:null, composited:null, search:'' }

async function pageProvador() {
  const { data } = await db.from('items').select('id,name,photo_url,size,color,categories(name)').not('photo_url','is',null).eq('status','disponivel').order('name')
  provador.items = (data||[]).map(i=>({...i, categories: Array.isArray(i.categories)?i.categories[0]||null:i.categories}))
  provador.selectedItem = null
  provador.customerPhoto = null
  provador.composited = null
  renderProvador()
}

function renderProvador() {
  const { items, selectedItem, customerPhoto, composited, search } = provador
  const filtered = items.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||(i.categories?.name||'').toLowerCase().includes(search.toLowerCase()))

  document.getElementById('page-content').innerHTML = `
    <div class="page-header"><div><h1>${icons.camera.replace('width="16" height="16"','width="20" height="20"')} Provador Virtual</h1><p>Veja como cada peça fica</p></div></div>
    <div class="provador-grid">
      <!-- Left: photo -->
      <div>
        <div class="card" style="padding:20px;margin-bottom:14px">
          <div class="section-title">${icons.upload} Foto da Cliente</div>
          ${!customerPhoto ? `
            <div class="photo-drop" onclick="document.getElementById('photo-input').click()">
              ${icons.upload}
              <p>Clique para enviar uma foto</p>
              <p style="font-size:11px">Foto de corpo inteiro funciona melhor</p>
            </div>` : `
            <div class="photo-result">
              <img id="result-img" src="${composited||customerPhoto}" alt="Cliente">
              <button class="btn-icon" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.5);color:white" onclick="provador.customerPhoto=null;provador.composited=null;renderProvador()">${icons.x}</button>
            </div>`}
          <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="handlePhotoUpload(event)">
          ${customerPhoto ? `
            <div style="display:flex;gap:8px;margin-top:10px">
              <button class="btn-secondary" style="flex:1;justify-content:center" onclick="document.getElementById('photo-input').click()">Trocar foto</button>
              ${composited ? `<button class="btn-primary" onclick="downloadResult()">${icons.download} Salvar</button>` : ''}
            </div>` : ''}
        </div>
        ${customerPhoto && selectedItem ? `
          <button class="btn-primary" style="width:100%;justify-content:center;padding:12px;font-size:15px" onclick="tryOn()" id="btn-tryon">
            ${icons.shirt} Experimentar: ${selectedItem.name}
          </button>` : `
          <div style="background:rgba(74,144,217,.08);border:1px solid rgba(74,144,217,.15);border-radius:10px;padding:14px;font-size:13px;color:var(--gray)">
            💡 <strong style="color:white">Dica:</strong> Envie uma foto da cliente e selecione uma peça ao lado para experimentar.
          </div>`}
      </div>
      <!-- Right: items -->
      <div class="card" style="padding:20px">
        <div class="section-title">${icons.shirt.replace('width="20" height="20"','width="16" height="16"')} Escolher Peça
          ${selectedItem?`<span style="font-size:11px;padding:3px 8px;border-radius:20px;background:rgba(74,144,217,.15);color:var(--accent)">${selectedItem.name}</span>`:''}
        </div>
        <input class="sf-input" style="margin-bottom:12px" placeholder="Buscar peça..." oninput="provador.search=this.value;renderProvador()" value="${search}">
        ${items.length===0 ? `<div class="empty">${icons.camera.replace('width="16" height="16"','width="36" height="36"')}<p style="font-size:13px">Nenhuma peça com foto disponível.</p><p style="font-size:12px">Adicione fotos nas peças do estoque.</p></div>` :
          `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;max-height:520px;overflow-y:auto;padding-right:4px">
            ${filtered.map(item=>`
              <div onclick="provador.selectedItem=${JSON.stringify(item).replace(/"/g,'&quot;');};renderProvador()"
                style="border-radius:10px;overflow:hidden;cursor:pointer;border:2px solid ${selectedItem?.id===item.id?'var(--accent)':'transparent'};transition:all .18s;transform:${selectedItem?.id===item.id?'scale(1.03)':'scale(1)'}">
                <img src="${item.photo_url}" alt="${item.name}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block">
                <div style="padding:6px 7px;background:${selectedItem?.id===item.id?'rgba(74,144,217,.15)':'var(--navy-dark)'}">
                  <div style="font-size:11px;font-weight:600;color:white;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.name}</div>
                  <div style="font-size:10px;color:var(--gray)">${item.categories?.name||''}</div>
                </div>
              </div>`).join('')}
          </div>`}
      </div>
    </div>
    <canvas id="provador-canvas" style="display:none"></canvas>`
}

function handlePhotoUpload(e) {
  const file = e.target.files?.[0]
  if(!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    provador.customerPhoto = ev.target.result
    provador.composited = null
    renderProvador()
  }
  reader.readAsDataURL(file)
}

async function tryOn() {
  const { customerPhoto, selectedItem } = provador
  if(!customerPhoto || !selectedItem) return
  const btn = document.getElementById('btn-tryon')
  if(btn) { btn.disabled=true; btn.innerHTML=`${icons.shirt} Processando...` }

  const canvas = document.getElementById('provador-canvas')
  const ctx = canvas.getContext('2d')
  const personImg = new Image()

  await new Promise(res => { personImg.onload=res; personImg.src=customerPhoto })
  canvas.width  = personImg.width
  canvas.height = personImg.height
  ctx.drawImage(personImg, 0, 0)

  const clothImg = new Image()
  clothImg.crossOrigin = 'anonymous'
  await new Promise(res => {
    clothImg.onload = () => {
      const cW = canvas.width * 0.55
      const cH = (clothImg.naturalHeight/clothImg.naturalWidth)*cW
      const cX = (canvas.width-cW)/2
      const cY = canvas.height*0.14
      ctx.globalAlpha = 0.78
      ctx.drawImage(clothImg, cX, cY, cW, cH)
      ctx.globalAlpha = 1
      ctx.fillStyle='rgba(26,39,68,0.75)'
      ctx.fillRect(0,canvas.height-52,canvas.width,52)
      ctx.fillStyle='white'
      ctx.font=`bold ${Math.round(canvas.width*0.026)}px Arial`
      ctx.textAlign='center'
      ctx.fillText(`Simply Frio — ${selectedItem.name}`, canvas.width/2, canvas.height-18)
      res()
    }
    clothImg.onerror = res
    clothImg.src = selectedItem.photo_url
  })

  provador.composited = canvas.toDataURL('image/jpeg', 0.92)
  renderProvador()
}

function downloadResult() {
  if(!provador.composited) return
  const a = document.createElement('a')
  a.href = provador.composited
  a.download = `simplyfrio-${provador.selectedItem?.name||'look'}.jpg`
  a.click()
}

// ─────────────────────────────────────────────
// Router map
// ─────────────────────────────────────────────
const pages = {
  dashboard:  pageDashboard,
  estoque:    pageEstoque,
  clientes:   pageClientes,
  alugueis:   pageAlugueis,
  vendas:     pageVendas,
  financeiro: pageFinanceiro,
  provador:   pageProvador,
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('login-user').value.trim()
    const password = document.getElementById('login-pass').value
    const btn = document.getElementById('btn-login')
    const err = document.getElementById('login-error')
    err.style.display = 'none'
    btn.disabled = true; btn.textContent = 'Entrando...'
    try {
      const user = await login(username, password)
      setSession({ id: user.id, username: user.username, role: user.role, full_name: user.full_name })
      startApp()
    } catch(ex) {
      err.textContent = ex.message
      err.style.display = 'block'
    } finally {
      btn.disabled = false; btn.textContent = 'Entrar'
    }
  })

  // Check existing session
  const saved = getSession()
  if(saved) {
    currentUser = saved
    startApp()
  }

  // Password toggle
  document.getElementById('toggle-pass')?.addEventListener('click', () => {
    const inp = document.getElementById('login-pass')
    const btn = document.getElementById('toggle-pass')
    if(inp.type==='password'){ inp.type='text'; btn.textContent='🙈' }
    else { inp.type='password'; btn.textContent='👁' }
  })
})

function startApp() {
  document.getElementById('login-screen').style.display = 'none'
  document.getElementById('app-screen').style.display = 'block'
  buildSidebar()
  navigate('dashboard')
}
