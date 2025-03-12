// src/pages/Configuracoes/components/UserList.jsx
import { Edit, Trash2, RefreshCw, UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import styles from '../styles.module.css'

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setTotalItems(data.length);
    } catch (error) {
      console.error('Erro ao carregar os usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setNome(user.nome);
    setEmail(user.email);
    setPassword('');
    setTipo(user.tipo);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentUser(null);
    setNome('');
    setEmail('');
    setPassword('');
    setTipo('');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do usuário a serem enviados:', { nome, email, password, tipo });
    try {
      await api.addUser({ nome, email, password, tipo });
      console.log('Usuário adicionado com sucesso');
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do usuário a serem atualizados:', { nome, email, password, tipo });
    try {
      await api.updateUser(currentUser.id, { nome, email, password, tipo });
      console.log('Usuário atualizado com sucesso');
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.deleteUser(currentUser.id);
      console.log('Usuário deletado com sucesso');
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Funções para paginação
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Filtrar usuários baseado no termo de busca
  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos para paginação
  const totalFilteredItems = filteredUsers.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  
  // Obter itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Tratamento para mudança de itens por página
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Volta para a primeira página ao mudar itens por página
  };

  return (
    <div className={styles.userListContainer}>
      <div className={styles.listHeader}>
        <div className={styles.headerTitle}>
          <h2>Usuários do Sistema</h2>
          <button 
            className={styles.refreshButton} 
            onClick={loadUsers} 
            title="Atualizar lista de usuários"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <button className={styles.addButton} onClick={handleAddUser}>
          <UserPlus size={16} />
          Adicionar Usuário
        </button>
      </div>

      <div className={styles.toolbarContainer}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Volta para a primeira página ao buscar
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando usuários...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles.emptyMessage}>
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  currentItems.map(user => (
                    <tr key={user.id} className={styles.tableRow}>
                      <td>{user.nome}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`${styles.tipoBadge} ${styles[user.tipo]}`}>
                          {user.tipo}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${user.status === 'ativo' ? styles.statusAtivo : styles.statusInativo}`}>
                          {user.status || 'ativo'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.actionButton} 
                            onClick={() => handleEditUser(user)}
                            title="Editar usuário"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`} 
                            onClick={() => handleDeleteUser(user)}
                            title="Excluir usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className={styles.paginationContainer}>
            <div className={styles.paginationInfo}>
              Mostrando {totalFilteredItems === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalFilteredItems)} de {totalFilteredItems} usuários
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
              </select>
            </div>
          </div>
        </>
      )}

      {/* Modal Adicionar Usuário */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Adicionar Usuário</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="advogado">Advogado</option>
                  <option value="policia">Polícia</option>
                  <option value="psicologo">Psicólogo</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>Adicionar</button>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Usuário */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Editar Usuário</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Senha (deixe em branco para manter a atual)</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="advogado">Advogado</option>
                  <option value="policia">Polícia</option>
                  <option value="psicologo">Psicólogo</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir Usuário */}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Excluir Usuário</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            <div className={styles.confirmDeleteContent}>
              <div className={styles.warningIcon}>
                <Trash2 size={48} />
              </div>
              <p>Tem certeza de que deseja excluir o usuário <strong>{currentUser?.nome}</strong>?</p>
              <p className={styles.warningText}>Esta ação não pode ser desfeita.</p>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
              <button type="button" className={styles.deleteConfirmButton} onClick={handleDeleteSubmit}>Confirmar Exclusão</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserList