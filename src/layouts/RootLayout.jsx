// RootLayout.jsx
import { Link, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Eye, BookOpen,
  Bell, LogOut, Settings, User
} from 'lucide-react'
import styles from './RootLayout.module.css'

const RootLayout = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>AMOR</h1>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
            <LayoutDashboard size={20} />
            Painel
          </Link>
          <Link to="/denuncias" className={`${styles.navLink} ${location.pathname === '/denuncias' ? styles.active : ''}`}>
            <FileText size={20} />
            Denúncias
          </Link>
          <Link to="/acompanhar" className={`${styles.navLink} ${location.pathname === '/acompanhar' ? styles.active : ''}`}>
            <Eye size={20} />
            Acompanhar
          </Link>
          <Link to="/conscientizacao" className={`${styles.navLink} ${location.pathname === '/conscientizacao' ? styles.active : ''}`}>
            <BookOpen size={20} />
            Conscientização
          </Link>
          <Link to="/configuracoes" className={`${styles.navLink} ${location.pathname === '/configuracoes' ? styles.active : ''}`}>
            <Settings size={20} />
            Definições
          </Link>
        </nav>

        <div className={styles.logout}>
          <button className={styles.logoutBtn}>
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h2>Dashboard</h2>
          <div className={styles.headerActions}>
            <Link to="/notificacoes" className={styles.headerIcon}>
              <Bell size={20} />
              <span className={styles.notificationBadge}>0</span>
            </Link>
            <Link to="/perfil" className={styles.headerIcon}>
              <User size={20} />
            </Link>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default RootLayout;