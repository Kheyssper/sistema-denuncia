// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

// Página temporária para teste
const TempPage = () => <div>Página em Construção</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<TempPage />} />
          <Route path="denuncia" element={<TempPage />} />
          <Route path="acompanhar" element={<TempPage />} />
          <Route path="conscientizacao" element={<TempPage />} />
          <Route path="perguntas" element={<TempPage />} />
          <Route path="categorias" element={<TempPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}