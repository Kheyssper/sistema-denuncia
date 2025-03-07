// src/services/api.js - mantendo a estrutura original
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao fazer login' };
  }
};

export const getDenuncias = async () => {
  const { data } = await api.get('/denuncias');
  return data;
};

export const getDenunciaById = async (id) => {
  const response = await api.get(`/denuncias/${id}`);
  console.log('Resposta completa do backend:', response);
  console.log('Dados da denúncia:', response.data);
  return response.data;
};

export const addAcompanhamento = async (id, comentario) => {
  const response = await api.post(`/denuncias/${id}/acompanhar`, { comentario });
  console.log('Resposta do backend ao adicionar acompanhamento:', response.data);
  return response.data;
};

export const getConscientizacao = async () => {
  const response = await api.get('/conscientizacao');
  console.log('Dados de conscientização:', response.data);
  return response.data;
};

// Adicionando a função getDenunciasPorTipo
export const getDenunciasPorTipo = async (tipo) => {
  const { data } = await api.get(`/denuncias/tipo/${tipo}`);
  return data;
};

export const deleteDenuncia = async (id) => {
  const response = await api.delete(`/denuncias/${id}`);
  console.log('Resposta do backend ao deletar denúncia:', response.data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  console.log('Dados dos usuários:', response.data);
  return response.data;
};

export const getSystemSettings = async () => {
  const response = await api.get('/system-settings');
  console.log('Configurações do sistema:', response.data);
  return response.data;
};

export const getLogs = async () => {
  const response = await api.get('/logs');
  console.log('Logs do sistema:', response.data);
  return response.data;
};

export const addUser = async (user) => {
  console.log('Dados do usuário recebidos no backend:', user);
  const response = await api.post('/users', user);
  console.log('Usuário adicionado:', response.data);
  return response.data;
};

export const updateUser = async (id, user) => {
  console.log('Dados do usuário a serem atualizados:', user);
  const response = await api.put(`/users/${id}`, user);
  console.log('Usuário atualizado:', response.data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  console.log('Usuário deletado:', response.data);
  return response.data;
};

export const addRecurso = async (recurso) => {
  console.log('Dados do recurso a serem adicionados:', recurso);
  const response = await api.post('/conscientizacao', recurso);
  console.log('Recurso adicionado:', response.data);
  return response.data;
};

export const updateRecurso = async (id, recurso) => {
  console.log('Dados do recurso a serem atualizados:', recurso);
  const response = await api.put(`/conscientizacao/${id}`, recurso);
  console.log('Recurso atualizado:', response.data);
  return response.data;
};

export const deleteRecurso = async (id) => {
  const response = await api.delete(`/conscientizacao/${id}`);
  console.log('Recurso deletado:', response.data);
  return response.data;
};

// export const getNotificacoes = async () => {
//   const response = await api.get('/notificacoes');
//   console.log('Dados das notificações:', response.data);
//   return response.data;
// };

export const getNotificacoes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/notificacoes?${queryParams}` : '/notificacoes';
    const response = await api.get(url);
    console.log('Resposta da API de notificações:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    throw error.response?.data || { message: 'Erro ao obter notificações' };
  }
};

export const getStats = async () => {
  const response = await api.get('/stats');
  console.log('Dados das estatísticas:', response.data);
  return response.data;
};

export const getMonthlyData = async () => {
  const response = await api.get('/monthly-data');
  console.log('Dados mensais:', response.data);
  return response.data;
};

export const updateDenunciaStatus = async (id, oldStatus, newStatus) => {
  try {
    const response = await api.put(`/denuncias/${id}/status`, {
      oldStatus,
      newStatus
    });
    console.log('Status da denúncia atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar o status da denúncia:', error);
    throw error;
  }
};

// NOVAS FUNÇÕES PARA O PERFIL
// ---------------------------

// Função para obter dados do usuário atual
// Correção da função getCurrentUser no arquivo api.js

// Função para obter dados do usuário atual
export const getCurrentUser = async () => {
  try {
    // Obter o ID do usuário logado (você precisa armazenar isso durante o login)
    const userId = localStorage.getItem('userId');

    if (!userId) {
      throw new Error('ID do usuário não encontrado');
    }

    // Buscar a lista de usuários
    const users = await getUsers();
    console.log('Dados do usuário atual:', users);

    // Encontrar o usuário correspondente ao ID
    const currentUser = users.find(user => user.id === parseInt(userId));

    if (!currentUser) {
      throw new Error('Usuário não encontrado');
    }

    return currentUser;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário atual:', error);
    throw error.response?.data || { message: 'Erro ao buscar dados do usuário' };
  }
};

// Função para atualizar dados do usuário atual
export const updateCurrentUser = async (userData) => {
  try {
    const response = await api.put('/users', userData);
    console.log('Dados do usuário atualizados:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    throw error.response?.data || { message: 'Erro ao atualizar dados do usuário' };
  }
};

// Função para alterar senha do usuário - corrigida para usar a rota correta
export const changePassword = async (passwordData) => {
  try {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      throw new Error('ID do usuário não encontrado');
    }

    // Formatar dados para o padrão Laravel
    const formattedData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      newPassword_confirmation: passwordData.confirmPassword || passwordData.newPassword_confirmation
    };

    // Corrigindo para usar a rota apropriada com o ID do usuário
    const response = await api.post(`/users/${userId}/change-password`, formattedData);
    console.log('Senha alterada com sucesso');
    return response.data;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error.response?.data || { message: 'Erro ao alterar senha' };
  }
};

export const marcarNotificacaoComoLida = async (id) => {
  try {
    const response = await api.put(`/notificacoes/${id}/marcar-lida`);
    return response.data;
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error.response?.data || { message: 'Erro ao marcar notificação como lida' };
  }
};

export const marcarTodasNotificacoesComoLidas = async () => {
  try {
    const response = await api.post('/notificacoes/marcar-todas-lidas');
    return response.data;
  } catch (error) {
    console.error('Erro ao marcar todas notificações como lidas:', error);
    throw error.response?.data || { message: 'Erro ao marcar todas notificações como lidas' };
  }
};

export const deleteNotificacao = async (id) => {
  try {
    const response = await api.delete(`/notificacoes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    throw error.response?.data || { message: 'Erro ao deletar notificação' };
  }
};



// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  getDenuncias,
  getDenunciaById,
  addAcompanhamento,
  deleteDenuncia,
  getUsers,
  getSystemSettings,
  getLogs,
  addUser,
  updateUser,
  deleteUser,
  getConscientizacao,
  addRecurso,
  updateRecurso,
  deleteRecurso,
  getNotificacoes,
  getStats,
  getMonthlyData,
  updateDenunciaStatus,
  // Adicionando as novas funções ao export default
  getCurrentUser,
  updateCurrentUser,
  changePassword,
  marcarNotificacaoComoLida,
  marcarTodasNotificacoesComoLidas,
  deleteNotificacao
};