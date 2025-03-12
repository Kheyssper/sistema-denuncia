import UserList from './components/UserList';
import styles from './styles.module.css';

const Configuracoes = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Gestão de Usuários</h1>
        <p className={styles.subtitle}>Administre os usuários do sistema</p>
      </div>
      
      <UserList />
    </div>
  );
};

export default Configuracoes;