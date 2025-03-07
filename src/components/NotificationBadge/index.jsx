// src/components/NotificationBadge/index.jsx
import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificacoes } from '../../context/NotificacoesContext';
import styles from './styles.module.css';

const NotificationBadge = () => {
  const { naoLidas } = useNotificacoes();

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
};

export default NotificationBadge;