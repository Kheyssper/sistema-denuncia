// src/contexts/NotificacoesContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getNotificacoes, marcarNotificacaoComoLida, marcarTodasNotificacoesComoLidas, deleteNotificacao } from '../services/api';
import { subscribeToNotificacoes, unsubscribeFromNotificacoes } from '../services/pusher';
import { useNavigate } from 'react-router-dom';

const NotificacoesContext = createContext();

export const NotificacoesProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  // Carregar notificações iniciais
  useEffect(() => {
    carregarNotificacoes();
    
    // Inscrever no canal do Pusher
    const unsubscribe = subscribeToNotificacoes(handleNovaNotificacao);
    
    // Cancelar inscrição ao desmontar
    return () => {
      unsubscribe();
      unsubscribeFromNotificacoes();
    };
  }, []);

  // Função para carregar notificações do servidor
  const carregarNotificacoes = async () => {
    try {
      setCarregando(true);
      const data = await getNotificacoes();
      setNotificacoes(data.data || []);
      
      // Contar notificações não lidas
      const naoLidasCount = (data.data || []).filter(notif => !notif.lida).length;
      setNaoLidas(naoLidasCount);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Função para lidar com novas notificações do Pusher
  const handleNovaNotificacao = (data) => {
    console.log('Nova notificação recebida via Pusher:', data);
    if (data.notificacao) {
      // Adicionar nova notificação ao estado
      setNotificacoes(prev => [data.notificacao, ...prev]);
      // Incrementar contador de não lidas
      setNaoLidas(prev => prev + 1);
      
      // Opcional: Mostrar uma notificação temporária na tela
      // toast.info(`Nova notificação: ${data.notificacao.titulo}`);
    }
  };

  // Função para marcar uma notificação como lida
  const marcarComoLida = async (id) => {
    try {
      await marcarNotificacaoComoLida(id);
      
      // Atualizar estado local
      setNotificacoes(prev => prev.map(notif => 
        notif.id === id ? { ...notif, lida: true } : notif
      ));
      
      // Atualizar contador de não lidas
      setNaoLidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };
  
  // Função para excluir uma notificação
  const removerNotificacao = async (id) => {
    try {
      await deleteNotificacao(id);
      
      // Verificar se a notificação era não lida
      const notificacao = notificacoes.find(n => n.id === id);
      const eraNaoLida = notificacao && !notificacao.lida;
      
      // Remover do estado local
      setNotificacoes(prev => prev.filter(notif => notif.id !== id));
      
      // Atualizar contador se necessário
      if (eraNaoLida) {
        setNaoLidas(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    }
  };
  
  // Função para marcar todas como lidas
  const limparTodas = async () => {
    try {
      await marcarTodasNotificacoesComoLidas();
      
      // Atualizar estado local
      setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
      setNaoLidas(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  };
  
  // Função para navegar para o link da notificação
  const navegarParaLink = (notificacao) => {
    if (notificacao.link) {
      // Se ainda não foi lida, marcar como lida
      if (!notificacao.lida) {
        marcarComoLida(notificacao.id);
      }
      navigate(notificacao.link);
    }
  };

  const value = {
    notificacoes,
    naoLidas,
    carregando,
    carregarNotificacoes,
    marcarComoLida,
    removerNotificacao,
    limparTodas,
    navegarParaLink
  };

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