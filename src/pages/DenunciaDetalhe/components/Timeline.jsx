import { CircleDot } from 'lucide-react'
import styles from '../styles.module.css'
const Timeline = ({ eventos }) => (
  <div className={styles.timeline}>
    {eventos.map((evento, index) => (
      <div key={index} className={styles.timelineItem}>
        <CircleDot size={16} />
        <div className={styles.timelineContent}>
          <span className={styles.timelineDate}>{evento.data}</span>
          <p>{evento.descricao}</p>
          <span className={styles.timelineUser}>{evento.usuario}</span>
        </div>
      </div>
    ))}
  </div>
)
export default Timeline;