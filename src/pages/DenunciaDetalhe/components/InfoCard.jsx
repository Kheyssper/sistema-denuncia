import styles from '../styles.module.css';

const InfoCard = ({ title, children }) => (
    <div className={styles.infoCard}>
      <h3>{title}</h3>
      {children}
    </div>
  )
  export default InfoCard