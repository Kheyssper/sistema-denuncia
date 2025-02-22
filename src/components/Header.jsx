const Header = () => {
    return (
      <header className="h-16 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 flex items-center justify-between px-6">
        <div className="text-white text-xl font-bold">Sistema de Denúncias</div>
        <div className="flex items-center gap-4 text-white">
          <span>0 Notificações</span>
          <span>Usuário</span>
        </div>
      </header>
    );
  };
  
  export default Header;