// src/services/pusher.js
import Pusher from 'pusher-js';

let pusher = null;
let notificacoesChannel = null;

export const initializePusher = () => {
  if (!pusher) {
    pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      encrypted: true
    });
    
    console.log('Pusher inicializado');
  }
  
  return pusher;
};

export const subscribeToNotificacoes = (callback) => {
  const pusherInstance = initializePusher();
  
  if (!notificacoesChannel) {
    notificacoesChannel = pusherInstance.subscribe('notificacoes');
    console.log('Inscrito no canal notificacoes');
  }
  
  // Remover listeners anteriores para evitar duplicações
  notificacoesChannel.unbind('App\\Events\\NovaDenuncia');
  
  // Adicionar novo listener
  notificacoesChannel.bind('App\\Events\\NovaDenuncia', (data) => {
    console.log('Nova notificação recebida:', data);
    if (callback && typeof callback === 'function') {
      callback(data);
    }
  });
  
  return () => {
    notificacoesChannel.unbind('App\\Events\\NovaDenuncia');
  };
};

export const unsubscribeFromNotificacoes = () => {
  if (pusher && notificacoesChannel) {
    pusher.unsubscribe('notificacoes');
    notificacoesChannel = null;
    console.log('Cancelada inscrição no canal notificacoes');
  }
};