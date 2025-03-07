// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Verifique se esta importação está correta

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
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };