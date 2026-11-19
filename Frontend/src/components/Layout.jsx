import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, CheckCheck, ChevronDown, CircleHelp, ClipboardList, LayoutDashboard, LogOut, MapPinned, Menu, Search, ShieldCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'MAYOR', 'WARD_CHAIRPERSON'] },
  { to: '/citizens', label: 'Citizen directory', icon: Users, roles: ['ADMIN', 'MAYOR', 'WARD_CHAIRPERSON'] },
  { to: '/register', label: 'Register citizen', icon: ClipboardList, roles: ['ADMIN', 'MAYOR', 'WARD_CHAIRPERSON'] },
  { to: '/verification', label: 'Verification queue', icon: CheckCheck, roles: ['ADMIN'] },
  { to: '/audit', label: 'Audit history', icon: ShieldCheck, roles: ['ADMIN'] }
];
export default function Layout() {
  const { user, logout } = useAuth(), [open, setOpen] = useState(false), navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
  return <div className="app-shell"><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="brand"><div className="brand-mark"><MapPinned size={19}/></div><div><strong>Dhulikhel</strong><span>Municipality</span></div><button className="icon-button mobile-close" onClick={() => setOpen(false)}><X size={18}/></button></div>
    <div className="workspace-label">{t('WORKSPACE')}</div><nav>{links.filter(x => x.roles.includes(user.role)).map(({to,label,icon:Icon})=><NavLink end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>`nav-link ${isActive?'active':''}`} key={to} to={to}><Icon size={17}/><span>{t(label)}</span>{to==='/verification'&&<span className="nav-dot"/>}</NavLink>)}</nav>
    <div className="sidebar-spacer"/><div className="sidebar-help"><div className="help-icon"><CircleHelp size={17}/></div><div><b>{t('Need assistance?')}</b><span>{t('Contact system administrator')}</span></div></div>
    <button className="profile-button" onClick={async()=>{await logout();navigate('/login')}}><div className="avatar">{initials}</div><div className="profile-copy"><b>{user?.name}</b><span>{user?.role==='WARD_CHAIRPERSON'?`Ward ${user.wardNumber} Chairperson`:user?.role==='ADMIN'?'System Administrator':'Mayor’s Office'}</span></div><LogOut size={16} className="profile-logout"/></button>
  </aside><div className="main-column"><header className="topbar"><button className="icon-button menu-toggle" onClick={()=>setOpen(!open)}><Menu size={19}/></button><div className="breadcrumb"><span>{t('Municipal Registry')}</span><span className="crumb-slash">/</span><b>{t('Overview')}</b></div><div className="top-actions"><button className="language-toggle" onClick={()=>setLanguage(language==='en'?'ne':'en')} lang={language==='ne'?'ne':'en'}>{language==='en'?'नेपाली':'English'}</button><div className="secure-label"><span/>{t('Secure workspace')}</div><button className="top-icon"><Search size={17}/></button><button className="top-icon"><Activity size={17}/></button><div className="top-avatar">{initials}</div></div></header><main className="page-content"><Outlet/></main><footer className="footer"><span>© 2026 Dhulikhel Municipality</span><span><BarChart3 size={13}/> {t('Citizen Information Management System')} <i/> v1.0</span></footer></div>{open&&<button className="scrim" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}</div>
}
