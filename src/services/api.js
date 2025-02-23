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
  const { data } = await api.get(`/denuncias/${id}`);
  return data;
};

export const addAcompanhamento = async (id, comentario) => {
  const { data } = await api.post(`/denuncias/${id}/acompanhar`, { comentario });
  return data;
};

export const getConscientizacao = async () => {
  const { data } = await api.get('/conscientizacao');
  return data;
};

// Adicionando a função getDenunciasPorTipo
export const getDenunciasPorTipo = async (tipo) => {
  const { data } = await api.get(`/denuncias/tipo/${tipo}`);
  return data;
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
  
export default api;