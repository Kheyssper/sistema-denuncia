import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext'; // Certifique-se de que o caminho está correto
import { getDenuncias, getDenunciasPorTipo } from '../services/api'; // Importando a função corretamente

export const useDenuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const { user } = useAuth();

  const fetchDenuncias = async () => {
    const data = user.tipo === 'admin'
      ? await getDenuncias()
      : await getDenunciasPorTipo(user.tipo);
    setDenuncias(data);
  };

  useEffect(() => { fetchDenuncias(); }, []);
  return { denuncias, recarregar: fetchDenuncias };
};