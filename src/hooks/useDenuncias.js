export const useDenuncias = () => {
    const [denuncias, setDenuncias] = useState([]);
    const { user } = useAuth();
   
    const fetchDenuncias = async () => {
      const data = user.tipo === 'admin' 
        ? await api.getDenuncias()
        : await api.getDenunciasPorTipo(user.tipo);
      setDenuncias(data);
    };
   
    useEffect(() => { fetchDenuncias(); }, []);
    return { denuncias, recarregar: fetchDenuncias };
   };