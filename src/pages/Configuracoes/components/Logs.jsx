// src/pages/Configuracoes/components/Logs.jsx
import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Clock, User, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../../services/api';
import styles from '../styles.module.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [filter, setFilter] = useState('all');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Erro ao carregar os logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedLogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle size={18} className={styles.logIconError} />;
      case 'warning':
        return <AlertTriangle size={18} className={styles.logIconWarning} />;
      case 'info':
      default:
        return <FileText size={18} className={styles.logIconInfo} />;
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  return (
    <div className={styles.logsContainer}>
      <div className={styles.logsHeader}>
        <div className={styles.headerTitle}>
          <h2>Logs do Sistema</h2>
          <button 
            className={styles.refreshButton} 
            onClick={loadLogs} 
            title="Atualizar logs"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <div className={styles.filterContainer}>
          <select 
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos os logs</option>
            <option value="info">Informações</option>
            <option value="warning">Avisos</option>
            <option value="error">Erros</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando logs...</p>
        </div>
      ) : (
        <div className={styles.logsList}>
          {filteredLogs.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={32} />
              <p>Nenhum log encontrado</p>
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className={`${styles.logItem} ${styles[log.type || 'info']}`}
              >
                <div 
                  className={styles.logHeader}
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className={styles.logTypeAndDate}>
                    {getLogTypeIcon(log.type)}
                    <span className={styles.logDate}>
                      <Clock size={14} />
                      {formatDateTime(log.timestamp || new Date())}
                    </span>
                  </div>
                  <div className={styles.logTitle}>
                    {log.title || log.message?.substring(0, 50) || 'Log do sistema'}
                  </div>
                  <button className={styles.expandButton}>
                    {expandedLogs[log.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                
                {expandedLogs[log.id] && (
                  <div className={styles.logDetails}>
                    <div className={styles.logDetail}>
                      <User size={14} />
                      <strong>Usuário:</strong> {log.user?.nome || 'Sistema'}
                    </div>
                    <div className={styles.logDetail}>
                      <Calendar size={14} />
                      <strong>Ação:</strong> {log.action || 'Operação do sistema'}
                    </div>
                    <div className={styles.logMessage}>
                      {log.message}
                    </div>
                    {log.details && (
                      <pre className={styles.logDetailsCode}>
                        {typeof log.details === 'object' 
                          ? JSON.stringify(log.details, null, 2) 
                          : log.details}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Logs;