// src/pages/Configuracoes/components/Logs.jsx
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import styles from '../styles.module.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await api.getLogs();
        setLogs(data);
      } catch (error) {
        console.error('Erro ao carregar os logs:', error);
      }
    };
    loadLogs();
  }, []);

  return (
    <div className={styles.logs}>
      <h2>Logs do Sistema</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>{log.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Logs;