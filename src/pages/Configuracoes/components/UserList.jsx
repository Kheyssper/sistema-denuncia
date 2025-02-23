// src/pages/Configuracoes/components/UserList.jsx
import { Edit, Trash2 } from 'lucide-react'
import styles from '../styles.module.css'

const UserList = () => {
  const users = [
    { id: 1, nome: 'Dr. Silva', email: 'silva@exemplo.com', tipo: 'Psicólogo', status: 'Ativo' },
    { id: 2, nome: 'Dra. Ana', email: 'ana@exemplo.com', tipo: 'Advogado', status: 'Ativo' }
  ]

  return (
    <div className={styles.userListContainer}>
      <div className={styles.userListHeader}>
        <h2>Usuários do Sistema</h2>
        <button className={styles.addButton}>Adicionar Usuário</button>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.tipo}</td>
              <td>
                <span className={styles.statusBadge}>{user.status}</span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.actionButton}><Edit size={16} /></button>
                  <button className={`${styles.actionButton} ${styles.deleteButton}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList





