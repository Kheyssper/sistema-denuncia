// src/services/pusher.js
import Pusher from 'pusher-js';

let pusher = null;
let notificacoesChannel = null;

export const initializePusher = () => {
  if (!pusher) {
    // Usando as variáveis de ambiente do Vite
    const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
    
    if (!pusherKey) {
      console.error('ERRO: VITE_PUSHER_APP_KEY não definido no arquivo .env');
      return null;
    }
    
    pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      encrypted: true
    });
    
    console.log('Pusher inicializado com key:', pusherKey, 'e cluster:', pusherCluster);
  }
  
  return pusher;
};

export const subscribeToNotificacoes = (callback) => {
  const pusherInstance = initializePusher();
  
  if (!pusherInstance) {
    console.error('Não foi possível inicializar o Pusher');
    return () => {};
  }
  
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

export default pusher;