import styles from '../styles.module.css'
import StatusBadge from './StatusBadge'
import { Eye, Trash2, ClipboardCheck } from 'lucide-react'
import { format, parseISO } from 'date-fns'

const DenunciaTable = ({ denuncias, onView, onDelete, onAcompanhar }) => {
  // Verificar se denuncias é um array válido
  if (!Array.isArray(denuncias)) {
    console.error('denuncias não é um array:', denuncias);
    return <div>Nenhuma denúncia encontrada</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Anônimo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {denuncias.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                Nenhuma denúncia encontrada
              </td>
            </tr>
          ) : (
            denuncias.map(denuncia => (
              <tr key={denuncia.id}>
                <td>#{denuncia.id}</td>
                <td>
                  {denuncia.data && typeof denuncia.data === 'string'
                    ? format(parseISO(denuncia.data), 'dd/MM/yyyy')
                    : 'Data inválida'}
                </td>
                <td><StatusBadge status={denuncia.status} /></td>
                <td>
                  <span className={`${styles.prioridade} ${styles[denuncia.prioridade]}`}>
                    {denuncia.prioridade}
                  </span>
                </td>
                <td>{denuncia.anonimo ? "Sim" : "Não"}</td>
                <td>
                  <div className={styles.acoes}>
                    <button onClick={() => onView(denuncia.id)} className={styles.actionBtn} title="Ver Detalhes">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onAcompanhar(denuncia.id)} className={`${styles.actionBtn} ${styles.acompanharBtn}`} title="Acompanhar">
                      <ClipboardCheck size={18} />
                    </button>
                    <button onClick={() => onDelete(denuncia.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DenunciaTable