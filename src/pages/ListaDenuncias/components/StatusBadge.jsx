import { Status } from "@chakra-ui/react"
import styles from '../styles.module.css'

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pendente: { bg: '#fee2e2', color: '#dc2626' },
    em_analise: { bg: '#fef9c3', color: '#ca8a04' },
    resolvido: { bg: '#dcfce7', color: '#16a34a' }
  }

  return (
    <span className={styles.statusBadge} style={{
      backgroundColor: statusStyles[status]?.bg,
      color: statusStyles[status]?.color
    }}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}
export default StatusBadge;