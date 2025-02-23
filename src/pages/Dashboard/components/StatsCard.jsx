import { TrendingUp } from 'lucide-react'
import styles from '../styles.module.css'

const StatsCard = ({ icon: Icon, title, value, trend, trendValue, bgColor, iconColor }) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon} style={{background: bgColor}}>
          <Icon size={22} color={iconColor} />
        </div>
        {trend && (
          <span className={styles.trendUp}>
            <TrendingUp size={14} />
            {trendValue}
          </span>
        )}
      </div>
      <div className={styles.statContent}>
        <p className={styles.statNumber}>{value}</p>
        <h3 className={styles.statTitle}>{title}</h3>
      </div>
    </div>
  )
} 
export default StatsCard;