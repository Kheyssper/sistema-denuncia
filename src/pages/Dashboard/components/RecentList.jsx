import { useEffect, useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import styles from '../styles.module.css';

const RecentList = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        const response = await api.getDenuncias();
        // Verificar a estrutura da resposta e extrair o array de denúncias
        const reports = response.data || response;
        
        // Garantir que temos um array antes de ordenar
        if (Array.isArray(reports)) {
          // Ordenar por data de criação, mais recentes primeiro
          const sortedReports = [...reports]
            .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
            .slice(0, 4); // Pegar apenas as 4 mais recentes
          setRecentReports(sortedReports);
        } else {
          console.error('A resposta da API não contém um array válido:', reports);
          setRecentReports([]);
        }
      } catch (error) {
        console.error('Erro ao buscar denúncias recentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return dateString;
    }
  };

  // Função para truncar texto longo
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    
    // Se o texto for mais curto que o limite, retorne-o como está
    if (text.length <= maxLength) return text;
    
    // Caso contrário, corte no último espaço antes do limite para não cortar palavras no meio
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    // Se não houver espaço, simplesmente corte no máximo
    if (lastSpaceIndex === -1) return truncated + '...';
    
    // Caso contrário, corte no último espaço
    return truncated.substring(0, lastSpaceIndex) + '...';
  };

  // Função para determinar a cor do status
  const getStatusColor = (status) => {
    const statusColors = {
      'em_analise': '#f59e0b', // Amarelo
      'resolvido': '#10b981', // Verde
      'pendente': '#ef4444', // Vermelho
    };
    return statusColors[status] || '#3b82f6';
  };

  return (
    <div className={styles.chartCard}>
      <h3>Denúncias Recentes</h3>
      
      {loading ? (
        <div className={styles.loadingState}>
          <p>Carregando denúncias...</p>
        </div>
      ) : recentReports.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle size={24} color="#94a3b8" />
          <p>Nenhuma denúncia encontrada.</p>
        </div>
      ) : (
        <div className={styles.recentListContainer}>
          {recentReports.map((report) => {
            console.log('Report:', report);
            // Determinar o ícone com base no status
            let StatusIcon = AlertCircle;
            
            return (
              <div key={report.id || Math.random()} className={styles.recentListItem}>
                <div className={styles.recentListIcon} style={{ background: getStatusColor(report.status) }}>
                  <StatusIcon size={16} color="white" />
                </div>
                <div className={styles.recentListContent}>
                  {/* <h4>{truncateText(report.titulo || report.title || 'Sem título', 60)}</h4> */}
                  <p>{truncateText(report.descricao || 70)}</p>
                  <div className={styles.recentListMeta}>
                    <span><Calendar size={12} /> {formatDate(report.created_at || report.dataRegistro || report.data || report.date)}</span>
                    <span><Clock size={12} /> {report.status || 'Não definido'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentList;