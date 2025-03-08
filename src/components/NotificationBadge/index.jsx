// src/components/NotificationBadge/index.jsx
import React, { memo } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificacoes } from '../../context/NotificacoesContext';
import { useAuth } from '../../context/AuthContext'; // Importe o contexto de auth
import styles from './styles.module.css';

const NotificationBadge = memo(() => {
  const { naoLidas, error } = useNotificacoes();
  const { user } = useAuth(); // Verifique se o usuário está autenticado
  
  // Não mostre o badge se o usuário não estiver logado ou houver erro de autenticação
  if (!user || error === 'Erro de autenticação') {
    return (
      <Link to="/notificacoes" className={styles.notification}>
        <Bell size={20} />
      </Link>
    );
  }
  
  return (
    <Link to="/notificacoes" className={styles.notification}>
      <Bell size={20} />
      {naoLidas > 0 && (
        <span className={styles.badge}>
          {naoLidas > 99 ? '99+' : naoLidas}
        </span>
      )}
    </Link>
  );
});

export default NotificationBadge;