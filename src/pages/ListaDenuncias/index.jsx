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
  const [filter, setFilter] = useState('');
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

  // Filtrar apenas se denuncias for um array
  const denunciasFiltradas = Array.isArray(denuncias) 
    ? denuncias.filter(denuncia => {
        // Verificar se denuncia existe e tem as propriedades necessárias
        if (!denuncia) return false;
        
        const matchesSearch = search === '' || 
          String(denuncia.id || '').includes(search) || 
          (denuncia.descricao && String(denuncia.descricao).toLowerCase().includes(search.toLowerCase()));
        
        const matchesFilter = filter === '' || denuncia.status === filter;
        
        return matchesSearch && matchesFilter;
      })
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lista de Denúncias</h1>
        <FilterBar onSearch={setSearch} onFilter={setFilter} />
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