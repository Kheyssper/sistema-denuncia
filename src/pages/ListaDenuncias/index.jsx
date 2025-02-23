// src/pages/ListaDenuncias/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from './components/FilterBar';
import DenunciaTable from './components/DenunciaTable';
import styles from './styles.module.css';
import { useDenuncias } from '../../hooks/useDenuncias'; // Certifique-se de que o caminho está correto
import api from '../../services/api';

const ListaDenuncias = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const { denuncias, recarregar } = useDenuncias();

  useEffect(() => {
    recarregar();
  }, []);

  const handleView = (id) => {
    navigate(`/denuncias/${id}`);
  };

  const handleDelete = (id) => {
    // Implementar lógica de soft delete
    console.log('Delete:', id);
  };

  const handleAcompanhar = (id) => {
    navigate(`/denuncias/${id}/acompanhamento`);
  };

  const handleAtribuir = async (id, profissionalId) => {
    await api.atribuirDenuncia(id, profissionalId);
    recarregar();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lista de Denúncias</h1>
        <FilterBar onSearch={setSearch} onFilter={setFilter} />
      </div>

      <DenunciaTable
        denuncias={denuncias}
        onView={handleView}
        onDelete={handleDelete}
        onAcompanhar={handleAcompanhar}
        onAtribuir={handleAtribuir}
      />
    </div>
  );
};

export default ListaDenuncias;