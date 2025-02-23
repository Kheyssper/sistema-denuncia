import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
};

export const getDenuncias = async () => {
    const { data } = await api.get('/denuncias');
    return data;
};

export const addAcompanhamento = async (id, acompanhamento) => {
    const { data } = await api.post(`/denuncias/${id}/acompanhamento`, acompanhamento);
    return data;
};

export const getDenunciasPorTipo = async (tipo) => {
    const { data } = await api.get(`/denuncias/profissional/${tipo}`);
    return data;
};

export const atribuirDenuncia = async (id, profissionalId) => {
    const { data } = await api.post(`/denuncias/${id}/atribuir`, { profissionalId });
    return data;
};

export const getConscientizacao = async () => {
    const { data } = await api.get('/conscientizacao');
    return data;
};