// src/pages/Notificacoes/index.jsx
import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Clock, X } from 'lucide-react';
import pusher from '../../services/pusher';
import api from '../../services/api';
import styles from './styles.module.css';

const NotificacaoCard = ({ notificacao, onDismiss }) => {
  const iconMap = {
    alerta: AlertTriangle,
    sucesso: CheckCircle,
    info: Info,
    pendente: Clock,
  };
  const Icon = iconMap[notificacao.tipo] || Info; // Verificação para garantir que Icon sempre tenha um valor válido

  return (
    <div className={`${styles.notificacaoCard} ${styles[notificacao.tipo]}`}>
      <div className={styles.notificacaoIconWrapper}>
        <Icon size={20} color="red"/>
      </div>
      <div className={styles.notificacaoContent}>
        <div className={styles.notificacaoHeader}>
          <h3>{notificacao.titulo}</h3>
          <span className={styles.timestamp} >{notificacao.tempo}</span>
        </div>
        <p>{notificacao.mensagem}</p>
        {notificacao.acao && (
          <button className={styles.actionButton}>
            {notificacao.acao}
          </button>
        )}
      </div>
      <button className={styles.dismissBtn} onClick={() => onDismiss(notificacao.id)}>
        <X size={16} />
      </button>
    </div>
  );
};

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const data = await api.getNotificacoes();
        setNotificacoes(data);
        setUnreadCount(data.filter(notificacao => !notificacao.lida).length);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };

    fetchNotificacoes();

    const channel = pusher.subscribe('denuncias');
    console.log('🔄 Tentando se inscrever no canal denuncias...');

    channel.bind('NovaDenuncia', (data) => {
      console.log('🔔 Nova denúncia recebida:', data);
      setNotificacoes((prevNotificacoes) => [data, ...prevNotificacoes]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      console.log('🛑 Cancelando inscrição no canal denuncias');
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleDismiss = (id) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const handleClearNotifications = () => {
    setUnreadCount(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Bell size={24} />
          <h1>Notificações</h1>
        </div>
        <button className={styles.clearAllBtn} onClick={handleClearNotifications}>
          Limpar Todas
        </button>
      </div>

      <div className={styles.notificacoesGrid}>
        {notificacoes.map(notificacao => (
          <NotificacaoCard 
            key={notificacao.id} 
            notificacao={notificacao}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
};

export default Notificacoes;