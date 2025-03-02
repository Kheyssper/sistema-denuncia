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

export const getNotificacoes = async () => {
  const response = await api.get('/notificacoes');
  console.log('Dados das notificações:', response.data);
  return response.data;
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
  getNotificacoes
};