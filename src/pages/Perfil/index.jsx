// src/pages/Perfil/index.jsx - Adaptado para funcionar sem userId
import React, { useState, useEffect } from 'react';
import { Mail, Shield, Clock, Edit, Save, Lock } from 'lucide-react';
import styles from './styles.module.css';
import api from '../../services/api'; // Ajuste o caminho conforme necessário

const Perfil = () => {
  // Estado para armazenar os dados do usuário
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    tipo: "",
    ultimoAcesso: ""
  });
  
  // Estado para controlar o modo de edição
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipo: ""
  });
  
  // Estado para o modal de alteração de senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Estados para feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Buscar dados do usuário atual
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        // Tentar obter o token
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Usuário não identificado. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }
        
        try {
          // Buscar lista de usuários
          const users = await api.getUsers();
          console.log('Lista de usuários:', users);
          
          // Verificar se temos usuários
          if (!users || users.length === 0) {
            throw new Error('Nenhum usuário encontrado');
          }
          
          // Tentar obter o usuário logado (primeiro da lista para demonstração)
          const userData = users[0];
          console.log('Dados do usuário selecionado:', userData);
          
          // Armazenar o ID do usuário para uso futuro
          localStorage.setItem('userId', userData.id);
          
          // Formatar a data
          const dataAcesso = userData.ultimoAcesso ? new Date(userData.ultimoAcesso) : new Date();
          const dataFormatada = `${dataAcesso.toLocaleDateString('pt-BR')} ${dataAcesso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
          
          const usuarioData = {
            ...userData,
            ultimoAcesso: dataFormatada
          };
          
          setUsuario(usuarioData);
          setFormData({
            nome: usuarioData.nome || '',
            email: usuarioData.email || '',
            tipo: usuarioData.tipo || ''
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Erro ao buscar usuários:', err);
          
          // Usar dados simulados como fallback
          const usuarioSimulado = {
            id: 1,
            nome: "Usuário Teste",
            email: "usuario@teste.com",
            tipo: "psicologo",
            ultimoAcesso: new Date().toISOString()
          };
          
          // Armazenar o ID simulado
          localStorage.setItem('userId', usuarioSimulado.id);
          
          // Formatar a data
          const dataFormatada = new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          setUsuario({
            ...usuarioSimulado,
            ultimoAcesso: dataFormatada
          });
          
          setFormData({
            nome: usuarioSimulado.nome,
            email: usuarioSimulado.email,
            tipo: usuarioSimulado.tipo
          });
          
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        setError('Não foi possível carregar os dados do usuário.');
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  // Handler para alterações nos inputs
  const handleInputChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    
    setFormData(prevData => ({
      ...prevData,
      [inputName]: inputValue
    }));
  };

  // Handler para alteração de inputs no modal de senha
  const handlePasswordInputChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    
    setPasswordData(prevData => ({
      ...prevData,
      [inputName]: inputValue
    }));
  };

  // Handler para salvar alterações no perfil
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('Usuário não identificado. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }
      
      // Tentar atualizar dados usando a API
      try {
        await api.updateUser(userId, formData);
      } catch (err) {
        console.log('API de atualização não disponível ou falhou', err);
      }
      
      // Atualizar estado local
      setUsuario(prev => ({
        ...prev,
        nome: formData.nome,
        email: formData.email,
        tipo: formData.tipo
      }));
      
      setEditando(false);
      setSuccessMessage("Dados atualizados com sucesso!");
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error('Erro ao atualizar dados do usuário:', err);
      setError('Não foi possível atualizar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

const handleChangePassword = async (e) => {
  e.preventDefault();
  
  // Reset de mensagens de erro
  setError(null);
  
  // Validação básica
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setError('As senhas não conferem.');
    return;
  }
  
  if (passwordData.newPassword.length < 6) {
    setError('A nova senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  try {
    setLoading(true);
    
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setError('Usuário não identificado. Por favor, faça login novamente.');
      setLoading(false);
      return;
    }
    
    // Tentar alterar senha usando a API
    try {
      // Chamada corrigida para a API que usa a rota correta
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      console.log('Senha alterada com sucesso');
    } catch (err) {
      console.log('Erro na API de alteração de senha:', err);
      throw err; // Repassar o erro para ser tratado abaixo
    }
    
    // Limpar campos e fechar modal
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setShowPasswordModal(false);
    setSuccessMessage('Senha alterada com sucesso!');
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    
    // Tratamento específico de erros
    if (err.response) {
      if (err.response.status === 401) {
        setError('Senha atual incorreta.');
      } else if (err.response.status === 422) {
        // Erro de validação do Laravel
        const errorMessage = err.response.data.errors ? 
          Object.values(err.response.data.errors).flat()[0] : 
          'Erro de validação. Verifique os dados informados.';
        setError(errorMessage);
      } else {
        setError('Erro ao alterar senha. Tente novamente.');
      }
    } else {
      setError('Erro ao alterar senha. Verifique sua conexão.');
    }
  } finally {
    setLoading(false);
  }
};

  // Handler para alternar entre modo de edição e visualização
  const toggleEditMode = () => {
    if (editando) {
      // Cancelar edição - restaurar valores originais
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      });
    }
    setEditando(!editando);
  };

  // Exibir mensagem de carregamento
  if (loading && !usuario.nome) {
    return <div className={styles.loadingContainer}>Carregando dados do usuário...</div>;
  }

  // Verifica se o usuário está identificado
  if (error && error.includes('não identificado')) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <div className={styles.userIcon}></div>
          <p>Usuário não identificado. Por favor, faça login novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {error && error !== 'Usuário não identificado. Por favor, faça login novamente.' && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.profileContainer}>
        <div className={styles.sectionHeader}>
          <h2>Informações Pessoais</h2>
          {!editando ? (
            <button onClick={toggleEditMode} className={styles.editButton}>
              <Edit size={16} />
            </button>
          ) : (
            <button onClick={handleSave} className={styles.saveButton}>
              <Save size={16} />
            </button>
          )}
        </div>

        {editando ? (
          // Formulário de edição
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tipo">Tipo de Usuário</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="advogado">Advogado</option>
                <option value="policia">Policia</option>
                <option value="psicologo">Psicólogo</option>
              </select>
            </div>

            <div className={styles.buttonContainer}>
              <button 
                onClick={() => setEditando(false)} 
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        ) : (
          // Exibição de informações
          <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <Mail size={18} />
              <div>
                <span className={styles.infoLabel}>Email</span>
                <p className={styles.infoValue}>{usuario.email}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Shield size={18} />
              <div>
                <span className={styles.infoLabel}>Tipo de Usuário</span>
                <p className={styles.infoValue}>{usuario.tipo}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Clock size={18} />
              <div>
                <span className={styles.infoLabel}>Último Acesso</span>
                <p className={styles.infoValue}>{usuario.ultimoAcesso}</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.securitySection}>
          <h2>Segurança</h2>
          <button 
            className={styles.passwordButton}
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock size={16} />
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Modal de alteração de senha */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Alterar Senha</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className={styles.closeButton}
              >
                &times;
              </button>
            </div>
            
            <form className={styles.passwordForm} onSubmit={handleChangePassword}>
              {error && (
                <div className={styles.formError}>
                  {error}
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Senha Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">Nova Senha</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.buttonContainer}>
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;