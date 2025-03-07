// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Enquanto verifica a autenticação, mostre algo (opcional)
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;