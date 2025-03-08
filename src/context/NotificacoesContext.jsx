// src/context/NotificacoesContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { getNotificacoes, marcarNotificacaoComoLida, marcarTodasNotificacoesComoLidas, deleteNotificacao } from '../services/api';
import { subscribeToNotificacoes, unsubscribeFromNotificacoes } from '../services/pusher';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importe o contexto de autenticação

const NotificacoesContext = createContext();

export const NotificacoesProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Verifique se o usuário está autenticado

  // Carregar notificações apenas se o usuário estiver autenticado
  const carregarNotificacoes = useCallback(async () => {
    // Se não houver usuário logado, não carregue notificações
    if (!user) {
      console.log('Usuário não autenticado, pulando carregamento de notificações');
      setCarregando(false);
      return;
    }

    console.log('Carregando notificações...');
    
    try {
      setCarregando(true);
      const data = await getNotificacoes();
      console.log('Notificações recebidas:', data);
      
      if (data && Array.isArray(data.data)) {
        setNotificacoes(data.data || []);
        const naoLidasCount = (data.data || []).filter(notif => !notif.lida).length;
        setNaoLidas(naoLidasCount);
      } else if (Array.isArray(data)) {
        setNotificacoes(data || []);
        const naoLidasCount = (data || []).filter(notif => !notif.lida).length;
        setNaoLidas(naoLidasCount);
      } else {
        console.log('Sem notificações ou formato inesperado');
        setNotificacoes([]);
        setNaoLidas(0);
      }
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      
      // Não tente recarregar se for erro de autenticação
      if (error.response && error.response.status === 401) {
        console.log('Erro de autenticação, não tentando recarregar');
        setError('Erro de autenticação');
      } else {
        setError('Erro ao carregar notificações');
      }
      
      // Limpe as notificações em caso de erro
      setNotificacoes([]);
      setNaoLidas(0);
    } finally {
      setCarregando(false);
    }
  }, [user]);

  // Handle nova notificação do Pusher
  const handleNovaNotificacao = useCallback((data) => {
    // Se não houver usuário logado, ignore novas notificações
    if (!user) return;
    
    console.log('Nova notificação recebida via Pusher:', data);
    if (data.notificacao) {
      setNotificacoes(prev => [data.notificacao, ...prev]);
      setNaoLidas(prev => prev + 1);
    }
  }, [user]);

  // Efeito para carregar notificações iniciais dependendo do status de autenticação
  useEffect(() => {
    console.log('NotificacoesProvider: status de autenticação mudou', !!user);
    
    let isMounted = true;
    let timeoutId = null;
    
    const fetchNotificacoes = async () => {
      if (!isMounted || !user) return;
      await carregarNotificacoes();
    };
    
    if (user) {
      fetchNotificacoes();
      
      // Apenas inscreva-se no Pusher se o usuário estiver autenticado
      let unsubscribe = null;
      try {
        unsubscribe = subscribeToNotificacoes(handleNovaNotificacao);
      } catch (error) {
        console.error('Erro ao se inscrever no Pusher:', error);
      }
      
      return () => {
        console.log('Limpando recursos de notificações');
        isMounted = false;
        
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        if (unsubscribe) {
          unsubscribe();
        }
        
        try {
          unsubscribeFromNotificacoes();
        } catch (error) {
          console.error('Erro ao cancelar inscrição:', error);
        }
      };
    } else {
      // Limpar notificações quando o usuário deslogar
      setNotificacoes([]);
      setNaoLidas(0);
      setCarregando(false);
    }
  }, [user, carregarNotificacoes, handleNovaNotificacao]);

  // Funções memoizadas para evitar recriação
  const marcarComoLida = useCallback(async (id) => {
    if (!user) return;
    
    try {
      await marcarNotificacaoComoLida(id);
      setNotificacoes(prev => prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      ));
      setNaoLidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, [user]);
  
  const removerNotificacao = useCallback(async (id) => {
    if (!user) return;
    
    try {
      await deleteNotificacao(id);
      const notificacao = notificacoes.find(n => n.id === id);
      const eraNaoLida = notificacao && !notificacao.lida;
      
      setNotificacoes(prev => prev.filter(notif => notif.id !== id));
      
      if (eraNaoLida) {
        setNaoLidas(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    }
  }, [user, notificacoes]);
  
  const limparTodas = useCallback(async () => {
    if (!user) return;
    
    try {
      await marcarTodasNotificacoesComoLidas();
      setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
      setNaoLidas(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  }, [user]);
  
  const navegarParaLink = useCallback((notificacao) => {
    if (!user) return;
    
    if (notificacao.link) {
      if (!notificacao.lida) {
        marcarComoLida(notificacao.id);
      }
      navigate(notificacao.link);
    }
  }, [user, navigate, marcarComoLida]);

  // Memorize o valor do contexto para evitar recriação
  const value = useMemo(() => ({
    notificacoes,
    naoLidas,
    carregando,
    error,
    carregarNotificacoes,
    marcarComoLida,
    removerNotificacao,
    limparTodas,
    navegarParaLink
  }), [
    notificacoes,
    naoLidas,
    carregando,
    error,
    carregarNotificacoes,
    marcarComoLida,
    removerNotificacao,
    limparTodas,
    navegarParaLink
  ]);

  return (
    <NotificacoesContext.Provider value={value}>
      {children}
    </NotificacoesContext.Provider>
  );
};

export const useNotificacoes = () => {
  const context = useContext(NotificacoesContext);
  if (!context) {
    throw new Error('useNotificacoes deve ser usado dentro de um NotificacoesProvider');
  }
  return context;
};