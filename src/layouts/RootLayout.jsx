// RootLayout.jsx
import { Link, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Eye, BookOpen,
  LogOut, Settings, User
} from 'lucide-react'
import styles from './RootLayout.module.css'
import NotificationBadge from '../components/NotificationBadge'

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
            <div className={styles.headerIcon}>
              <NotificationBadge />
            </div>
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