// src/pages/Configuracoes/components/SystemSettings.jsx
import { useState } from 'react';
import { Save, Grid3X3, Mail, Clock, User, Shield, Bell, Database } from 'lucide-react';
import styles from '../styles.module.css';

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    systemName: 'Sistema de Denúncias',
    notificationEmail: 'notificacoes@sistema.com',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpirationDays: 90,
    notificationsEnabled: true,
    emailNotifications: true,
    twoFactorAuth: false,
    dataRetentionDays: 365,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Configurações atualizadas:', formData);
    // Aqui você implementaria a chamada à API para salvar as configurações
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h2>Configurações do Sistema</h2>
      </div>

      <form className={styles.settingsForm} onSubmit={handleFormSubmit}>
        <div className={styles.settingsGroup}>
          <h3 className={styles.settingsGroupTitle}>
            <Grid3X3 size={18} />
            Configurações Gerais
          </h3>
          <div className={styles.settingsGroupContent}>
            <div className={styles.formGroup}>
              <label htmlFor="systemName">
                <User size={16} />
                Nome do Sistema
              </label>
              <input 
                type="text" 
                id="systemName"
                name="systemName"
                value={formData.systemName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="notificationEmail">
                <Mail size={16} />
                Email para Notificações
              </label>
              <input 
                type="email" 
                id="notificationEmail" 
                name="notificationEmail"
                value={formData.notificationEmail}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="sessionTimeout">
                  <Clock size={16} />
                  Tempo de Expiração de Sessão (minutos)
                </label>
                <input 
                  type="number" 
                  id="sessionTimeout" 
                  name="sessionTimeout"
                  value={formData.sessionTimeout}
                  onChange={handleInputChange}
                  min="5"
                  max="120"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="maxLoginAttempts">
                  <Shield size={16} />
                  Máximo de Tentativas de Login
                </label>
                <input 
                  type="number" 
                  id="maxLoginAttempts" 
                  name="maxLoginAttempts"
                  value={formData.maxLoginAttempts}
                  onChange={handleInputChange}
                  min="3"
                  max="10"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.settingsGroup}>
          <h3 className={styles.settingsGroupTitle}>
            <Bell size={18} />
            Notificações e Segurança
          </h3>
          <div className={styles.settingsGroupContent}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleInputChange}
                />
                <span>Notificações no Sistema</span>
              </label>
              <p className={styles.helperText}>Ativar notificações dentro do painel de administração</p>
            </div>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleInputChange}
                />
                <span>Notificações por Email</span>
              </label>
              <p className={styles.helperText}>Enviar notificações por email para os usuários</p>
            </div>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="twoFactorAuth"
                  checked={formData.twoFactorAuth}
                  onChange={handleInputChange}
                />
                <span>Autenticação de Dois Fatores</span>
              </label>
              <p className={styles.helperText}>Exigir autenticação de dois fatores para todos os usuários</p>
            </div>
          </div>
        </div>
        
        <div className={styles.settingsGroup}>
          <h3 className={styles.settingsGroupTitle}>
            <Database size={18} />
            Retenção de Dados
          </h3>
          <div className={styles.settingsGroupContent}>
            <div className={styles.formGroup}>
              <label htmlFor="dataRetentionDays">
                <Clock size={16} />
                Período de Retenção de Dados (dias)
              </label>
              <input 
                type="number" 
                id="dataRetentionDays" 
                name="dataRetentionDays"
                value={formData.dataRetentionDays}
                onChange={handleInputChange}
                min="30"
              />
              <p className={styles.helperText}>Define por quanto tempo os dados serão mantidos no sistema</p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="passwordExpirationDays">
                <Shield size={16} />
                Expiração de Senha (dias)
              </label>
              <input 
                type="number" 
                id="passwordExpirationDays" 
                name="passwordExpirationDays"
                value={formData.passwordExpirationDays}
                onChange={handleInputChange}
                min="30"
                max="365"
              />
              <p className={styles.helperText}>Define quando os usuários precisarão alterar suas senhas</p>
            </div>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>
            <Save size={16} />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;