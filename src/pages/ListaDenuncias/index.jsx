// src/pages/ListaDenuncias/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from './components/FilterBar';
import DenunciaTable from './components/DenunciaTable';
import styles from './styles.module.css';
import api from '../../services/api';

const ListaDenuncias = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('');
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarDenuncias = async () => {
    try {
      setLoading(true);
      const response = await api.getDenuncias();
      console.log('Dados recebidos da API:', response);
      
      // Garantir que denuncias seja sempre um array
      const denunciasArray = Array.isArray(response) ? response : 
                            (response && Array.isArray(response.data)) ? response.data : [];
      
      setDenuncias(denunciasArray);
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDenuncias();
  }, []);

  const handleView = (id) => {
    navigate(`/denuncias/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      console.log(`Delete: ${id}`);
      await api.deleteDenuncia(id);
      console.log('Denúncia deletada com sucesso');
      carregarDenuncias();
    } catch (error) {
      console.error('Erro ao deletar a denúncia:', error);
    }
  };

  const handleAcompanhar = (id) => {
    navigate(`/denuncias/${id}/acompanhamento`);
  };

  const handleAtribuir = async (id, profissionalId) => {
    try {
      await api.atribuirDenuncia(id, profissionalId);
      carregarDenuncias();
    } catch (error) {
      console.error('Erro ao atribuir a denúncia:', error);
    }
  };

  // Função para lidar com o filtro de prioridade
  const handlePrioridadeFilter = (prioridade) => {
    setPrioridadeFilter(prioridade);
    console.log('Filtro de prioridade aplicado:', prioridade);
  };

  // Filtrar apenas se denuncias for um array
  const denunciasFiltradas = Array.isArray(denuncias) 
    ? denuncias.filter(denuncia => {
        // Verificar se denuncia existe e tem as propriedades necessárias
        if (!denuncia) return false;
        
        // Filtro de busca por texto (ID ou descrição)
        const matchesSearch = search === '' || 
          String(denuncia.id || '').includes(search) || 
          (denuncia.descricao && String(denuncia.descricao).toLowerCase().includes(search.toLowerCase()));
        
        // Filtro por status
        const matchesStatus = statusFilter === '' || denuncia.status === statusFilter;
        
        // Filtro por prioridade
        const matchesPrioridade = prioridadeFilter === '' || denuncia.prioridade === prioridadeFilter;
        
        // Aplicar todos os filtros
        return matchesSearch && matchesStatus && matchesPrioridade;
      })
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lista de Denúncias</h1>
        <FilterBar 
          onSearch={setSearch} 
          onFilter={setStatusFilter} 
          onPriorityFilter={handlePrioridadeFilter} 
        />
      </div>

      {loading ? (
        <p>Carregando denúncias...</p>
      ) : (
        <DenunciaTable
          denuncias={denunciasFiltradas}
          onView={handleView}
          onDelete={handleDelete}
          onAcompanhar={handleAcompanhar}
          onAtribuir={handleAtribuir}
        />
      )}
    </div>
  );
};

export default ListaDenuncias;