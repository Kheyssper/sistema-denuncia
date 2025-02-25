import UserList from './components/UserList';
import SystemSettings from './components/SystemSettings';
import Logs from './components/Logs';
import styles from './styles.module.css';

const Configuracoes = () => {
  return (
    <div className={styles.pageContainer}>
      <UserList />
      <div className={styles.settingsGrid}>
        <SystemSettings />
      </div>
    </div>
  );
};

export default Configuracoes;