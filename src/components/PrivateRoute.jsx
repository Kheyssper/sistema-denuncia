// src/components/PrivateRoute.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import RootLayout from "../layouts/RootLayout";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
  };
  
  // App.jsx
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    }>
      {/* outras rotas */}
    </Route>
  </Routes>

  export default PrivateRoute;