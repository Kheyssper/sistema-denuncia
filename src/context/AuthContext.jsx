// src/context/AuthContext.jsx - função login corrigida
import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { login as apiLogin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para inicializar a autenticação
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // Verifique se api existe antes de usá-lo
          if (api && api.defaults) {
            // Configure o token no cabeçalho das requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            console.error('API não está definida corretamente');
          }
          
          // Configure o usuário no estado
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        // Finalize o carregamento
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Adicione a função login correta
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      
      if (response && response.token && response.user) {
        // Armazene o token e o usuário
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Configure o token para as requisições
        if (api && api.defaults) {
          api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        }
        
        // Atualize o estado do usuário
        setUser(response.user);
        
        return response.user;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Verifique se api existe antes de usá-lo
    if (api && api.defaults && api.defaults.headers) {
      delete api.defaults.headers.common['Authorization'];
    }
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };