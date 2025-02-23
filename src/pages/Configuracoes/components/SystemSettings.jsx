// src/pages/Configuracoes/components/SystemSettings.jsx
import styles from '../styles.module.css'

const SystemSettings = () => {
  return (
    <div className={styles.settingsContainer}>
      <h2>Configurações do Sistema</h2>
      <form className={styles.settingsForm}>
        <div className={styles.formGroup}>
          <label>Nome do Sistema</label>
          <input type="text" defaultValue="Sistema de Denúncias" />
        </div>
        <div className={styles.formGroup}>
          <label>Email para Notificações</label>
          <input type="email" defaultValue="notificacoes@sistema.com" />
        </div>
        <div className={styles.formGroup}>
          <label>Tempo de Expiração de Sessão (minutos)</label>
          <input type="number" defaultValue="30" />
        </div>
        <button type="submit" className={styles.saveButton}>
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}

export default SystemSettings