// src/pages/Configuracoes/components/Logs.jsx
import styles from '../styles.module.css'

const Logs = () => {
  const logs = [
    { id: 1, data: '23/02/2024 15:30', usuario: 'Dr. Silva', acao: 'Login no sistema' },
    { id: 2, data: '23/02/2024 15:45', usuario: 'Dr. Silva', acao: 'Visualizou denúncia #123' }
  ]

  return (
    <div className={styles.logsContainer}>
      <h2>Logs do Sistema</h2>
      <div className={styles.logsList}>
        {logs.map(log => (
          <div key={log.id} className={styles.logItem}>
            <span className={styles.logDate}>{log.data}</span>
            <span className={styles.logUser}>{log.usuario}</span>
            <span className={styles.logAction}>{log.acao}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logs