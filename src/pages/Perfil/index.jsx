// src/pages/Perfil/index.jsx
import { User, Mail, Shield, Key } from 'lucide-react'
import styles from './styles.module.css'

const Perfil = () => {
  const usuario = {
    nome: "Dr. Silva",
    email: "silva@exemplo.com",
    cargo: "Psicólogo",
    ultimoAcesso: "23/02/2024 15:30"
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userAvatar}>
          <User size={40} />
        </div>
        <h1>{usuario.nome}</h1>
        <span>{usuario.cargo}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.infoSection}>
          <h2>Informações Pessoais</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Mail size={20} />
              <div>
                <label>Email</label>
                <p>{usuario.email}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Shield size={20} />
              <div>
                <label>Cargo</label>
                <p>{usuario.cargo}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.securitySection}>
          <h2>Segurança</h2>
          <button className={styles.securityBtn}>
            <Key size={20} />
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  )
}

export default Perfil