import { Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard/index'
import ListaDenuncias from './pages/ListaDenuncias/index'
import DenunciaDetalhe from './pages/DenunciaDetalhe/index'
import Configuracoes from './pages/Configuracoes/index'
import DenunciaAcompanhamento from './pages/DenunciaAcompanhamento/index'
import Conscientizacao from './pages/Conscientizacao'
import Perfil from './pages/Perfil'
import Notificacoes from './pages/Notificacoes'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><RootLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="denuncias" element={<ListaDenuncias />} />
        <Route path="denuncias/:id" element={<DenunciaDetalhe />} />
        <Route path="denuncias/:id/acompanhamento" element={<DenunciaAcompanhamento />} />
        <Route path="conscientizacao" element={<Conscientizacao />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="notificacoes" element={<Notificacoes />} />
      </Route>
    </Routes>
  )
}

export default App