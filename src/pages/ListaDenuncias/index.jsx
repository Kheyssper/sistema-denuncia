// src/pages/ListaDenuncias/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, Filter, Search } from 'lucide-react';
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
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const carregarDenuncias = async () => {
    try {
      setLoading(true);
      const response = await api.getDenuncias();
      console.log('Dados recebidos da API:', response);
      
      // Garantir que denuncias seja sempre um array
      const denunciasArray = Array.isArray(response) ? response : 
                            (response && Array.isArray(response.data)) ? response.data : [];
      
      setDenuncias(denunciasArray);
      setTotalItems(denunciasArray.length);
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
    if (window.confirm('Tem certeza que deseja excluir esta denúncia?')) {
      try {
        console.log(`Delete: ${id}`);
        await api.deleteDenuncia(id);
        console.log('Denúncia deletada com sucesso');
        carregarDenuncias();
      } catch (error) {
        console.error('Erro ao deletar a denúncia:', error);
      }
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
    setCurrentPage(1); // Reset para a primeira página ao filtrar
    console.log('Filtro de prioridade aplicado:', prioridade);
  };

  // Funções para paginação
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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

  // Cálculos para paginação
  const totalFilteredItems = denunciasFiltradas.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  
  // Obter itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = denunciasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  // Tratamento para mudança de itens por página
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Volta para a primeira página ao mudar itens por página
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Lista de Denúncias</h1>
          <button className={styles.refreshButton} onClick={carregarDenuncias} title="Atualizar lista">
            <RefreshCw size={18} />
          </button>
        </div>
        <FilterBar 
          onSearch={setSearch} 
          onFilter={setStatusFilter} 
          onPriorityFilter={handlePrioridadeFilter} 
        />
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando denúncias...</p>
        </div>
      ) : (
        <>
          <DenunciaTable
            denuncias={currentItems}
            onView={handleView}
            onDelete={handleDelete}
            onAcompanhar={handleAcompanhar}
            onAtribuir={handleAtribuir}
          />

          {/* Paginação */}
          <div className={styles.paginationContainer}>
            <div className={styles.paginationInfo}>
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalFilteredItems)} de {totalFilteredItems} denúncias
            </div>
            
            <div className={styles.paginationControls}>
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
                title="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Lógica para mostrar as páginas ao redor da página atual
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (currentPage <= 3) {
                    pageToShow = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => paginate(pageToShow)}
                      className={`${styles.pageNumber} ${currentPage === pageToShow ? styles.activePage : ''}`}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages || totalPages === 0}
                className={`${styles.paginationButton} ${currentPage === totalPages || totalPages === 0 ? styles.paginationButtonDisabled : ''}`}
                title="Próxima página"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className={styles.itemsPerPage}>
              <select 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                className={styles.itemsPerPageSelect}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListaDenuncias;