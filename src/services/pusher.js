import Pusher from 'pusher-js';
const pusher = new Pusher('c867efe2369c671c7209',
    {
        cluster: 'ap2',
        encrypted: true,
    });



// Adicionar event listeners para conexão
pusher.connection.bind('connected', () => {
    console.log('✅ Pusher conectado com sucesso!');
});

pusher.connection.bind('failed', () => {
    console.error('❌ Falha na conexão com Pusher');
});

pusher.connection.bind('error', (err) => {
    console.error('❌ Erro de conexão Pusher:', err);
});
export default pusher;