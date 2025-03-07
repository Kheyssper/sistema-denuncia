// src/pages/Notificacoes/index.jsx
import { useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle, Info, Clock, X, Loader } from 'lucide-react'
import styles from './styles.module.css'
import { useNotificacoes } from '../../context/NotificacoesContext'
import { format, formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'

const NotificacaoCard = ({ notificacao, onDismiss, onClick }) => {
  const iconMap = {
    alerta: AlertTriangle,
    sucesso: CheckCircle,
    info: Info,
    pendente: Clock
  }
  
  // Usar o tipo da notificação ou padrão para 'info'
  const Icon = iconMap[notificacao.tipo] || iconMap.info;
  
  // Formatar a data relativa
  const tempoRelativo = notificacao.tempo 
    ? formatDistance(new Date(notificacao.tempo), new Date(), { 
        addSuffix: true,
        locale: pt
      })
    : 'Agora mesmo';

  return (
    <div 
      className={`${styles.notificacaoCard} ${styles[notificacao.tipo]} ${!notificacao.lida ? styles.naoLida : ''}`}
      onClick={() => onClick(notificacao)}
    >
      <div className={styles.notificacaoIconWrapper}>
        <Icon size={20} />
      </div>
      <div className={styles.notificacaoContent}>
        <div className={styles.notificacaoHeader}>
          <h3>{notificacao.titulo}</h3>
          <span className={styles.timestamp}>{tempoRelativo}</span>
        </div>
        <p>{notificacao.mensagem}</p>
        {notificacao.acao && (
          <button className={styles.actionButton}>
            {notificacao.acao}
          </button>
        )}
      </div>
      <button 
        className={styles.dismissBtn} 
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notificacao.id);
        }}
      >
        <X size={16} />
      </button>
    </div>
  )
}

const Notificacoes = () => {
  const { 
    notificacoes, 
    carregando, 
    carregarNotificacoes, 
    removerNotificacao, 
    limparTodas,
    navegarParaLink 
  } = useNotificacoes();

  // Recarregar notificações quando o componente montar
  useEffect(() => {
    carregarNotificacoes();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Bell size={24} />
          <h1>Notificações</h1>
        </div>
        <button 
          className={styles.clearAllBtn}
          onClick={limparTodas}
        >
          Limpar Todas
        </button>
      </div>

      {carregando ? (
        <div className={styles.loadingContainer}>
          <Loader size={32} className={styles.loader} />
          <p>Carregando notificações...</p>
        </div>
      ) : notificacoes.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Bell size={48} className={styles.emptyIcon} />
          <p>Não há notificações no momento</p>
        </div>
      ) : (
        <div className={styles.notificacoesGrid}>
          {notificacoes.map(notificacao => (
            <NotificacaoCard 
              key={notificacao.id} 
              notificacao={notificacao}
              onDismiss={removerNotificacao}
              onClick={navegarParaLink}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Notificacoes