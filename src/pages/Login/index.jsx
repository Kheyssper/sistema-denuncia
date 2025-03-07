// src/pages/Login/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import styles from './styles.module.css';
import { useAuth } from '../../context/AuthContext'; // Importe o hook useAuth

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use o hook useAuth
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use a função login do contexto
      await login({
        email: formData.email,
        password: formData.password
      });

      // Redirecionar para o dashboard
      navigate('/');
      console.log('Login bem sucedido, redirecionando...');
    } catch (error) {
      setError('Email ou senha inválidos');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoSection}>
          <h1>AMOR</h1>
          <p>Sistema de Denúncias e Apoio</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Bem-vindo(a) de volta</h2>
          <p className={styles.subtitle}>Faça login para acessar o sistema</p>

          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="Seu email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="/recuperar-senha" className={styles.forgotPassword}>
              Esqueceu a senha?
            </a>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.overlay}>
          <h2>Sistema de Apoio às Vítimas</h2>
          <p>Plataforma segura e confidencial para gestão de denúncias e suporte às vítimas</p>
        </div>
      </div>
    </div>
  );
};

export default Login;