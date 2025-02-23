// src/pages/ListaDenuncias/index.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterBar from './components/FilterBar'
import DenunciaTable from './components/DenunciaTable'
import styles from './styles.module.css'

const ListaDenuncias = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const { denuncias, recarregar } = useDenuncias();


  // const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    const fetchDenuncias = async () => {
      const data = await getDenuncias();
      setDenuncias(data);
    };
    fetchDenuncias();
  }, []);

  // Dados de exemplo
  // const denuncias = [
  //   {
  //     id: 1,
  //     data: '2024-02-23',
  //     status: 'pendente',
  //     prioridade: 'alta',
  //     ultimo_acompanhamento: '2024-02-22 15:30',
  //     responsavel: 'Dr. Silva',
  //     anonimo: true
  //   },
  //   {
  //     id: 2,
  //     data: '2024-02-23',
  //     status: 'completo',
  //     prioridade: 'media',
  //     ultimo_acompanhamento: '2024-02-22 15:30',
  //     responsavel: 'Dr. Silva',
  //     anonimo: false
  //   },
  //   {
  //     id: 3,
  //     data: '2024-02-23',
  //     status: 'pendente',
  //     prioridade: 'baixa',
  //     ultimo_acompanhamento: '2024-02-22 15:30',
  //     responsavel: 'Dr. Silva',
  //     anonimo: true
  //   },
  //   // ... mais denúncias
  // ]

  const handleView = (id) => {
    navigate(`/denuncias/${id}`)
  }

  const handleDelete = (id) => {
    // Implementar lógica de soft delete
    console.log('Delete:', id)
  }

  const handleAcompanhar = (id) => {
    navigate(`/denuncias/${id}/acompanhamento`)
  }

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
  )
}

export default ListaDenuncias