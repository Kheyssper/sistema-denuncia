// src/pages/Configuracoes/components/UserList.jsx
import { Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import styles from '../styles.module.css'

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    };
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
      const data = await api.getUsers();
      setUsers(data);
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
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.deleteUser(currentUser.id);
      console.log('Usuário deletado com sucesso');
      handleCloseModal();
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  return (
    <div className={styles.userListContainer}>
      <div className={styles.userListHeader}>
        <h2>Usuários do Sistema</h2>
        <button className={styles.addButton} onClick={handleAddUser}>Adicionar Usuário</button>
      </div>
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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.tipo}</td>
              <td>
                <span className={styles.statusBadge}>{user.status}</span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.actionButton} onClick={() => handleEditUser(user)}><Edit size={16} /></button>
                  <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDeleteUser(user)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Adicionar Usuário</h2>
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

      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Editar Usuário</h2>
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
                <label htmlFor="password">Senha</label>
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
                <button type="submit" className={styles.submitButton}>Salvar</button>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Excluir Usuário</h2>
            <p>Tem certeza de que deseja excluir o usuário {currentUser?.nome}?</p>
            <div className={styles.formActions}>
              <button type="button" className={styles.submitButton} onClick={handleDeleteSubmit}>Excluir</button>
              <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserList





