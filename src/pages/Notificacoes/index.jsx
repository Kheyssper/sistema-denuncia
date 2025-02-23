// src/pages/Notificacoes/index.jsx
import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle, Info, Clock, X } from 'lucide-react'
import styles from './styles.module.css'

const NotificacaoCard = ({ notificacao, onDismiss }) => {
  const iconMap = {
    alerta: AlertTriangle,
    sucesso: CheckCircle,
    info: Info,
    pendente: Clock
  }
  const Icon = iconMap[notificacao.tipo]

  return (
    <div className={`${styles.notificacaoCard} ${styles[notificacao.tipo]}`}>
      <div className={styles.notificacaoIconWrapper}>
        <Icon size={20} />
      </div>
      <div className={styles.notificacaoContent}>
        <div className={styles.notificacaoHeader}>
          <h3>{notificacao.titulo}</h3>
          <span className={styles.timestamp}>{notificacao.tempo}</span>
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
  )
}

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      tipo: 'alerta',
      titulo: 'Nova Denúncia Urgente',
      mensagem: 'Uma nova denúncia com prioridade alta foi registrada e requer sua atenção imediata.',
      tempo: 'Agora mesmo',
      acao: 'Ver Denúncia'
    },
    {
      id: 2,
      tipo: 'sucesso',
      titulo: 'Acompanhamento Concluído',
      mensagem: 'O acompanhamento da denúncia #123 foi finalizado com sucesso.',
      tempo: '1 hora atrás'
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Atualização do Sistema',
      mensagem: 'Novas funcionalidades foram adicionadas ao sistema de denúncias.',
      tempo: '2 horas atrás',
      acao: 'Saiba Mais'
    },
    {
      id: 4,
      tipo: 'pendente',
      titulo: 'Aguardando Revisão',
      mensagem: 'Existem 3 denúncias aguardando sua revisão.',
      tempo: '3 horas atrás',
      acao: 'Revisar Agora'
    }
  ])

  const handleDismiss = (id) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Bell size={24} />
          <h1>Notificações</h1>
        </div>
        <button className={styles.clearAllBtn}>
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
  )
}

export default Notificacoes