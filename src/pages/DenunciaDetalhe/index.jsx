import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User, MapPin, AlertTriangle, Clock, Shield } from 'lucide-react'
import InfoCard from './components/InfoCard'
import styles from './styles.module.css'
import { getDenunciaById } from '../../services/api'

const DenunciaDetalhe = () => {
  const { id } = useParams()
  const [denuncia, setDenuncia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDenuncia = async () => {
      try {
        setLoading(true)
        const data = await getDenunciaById(id)
        setDenuncia(data)
      } catch (error) {
        console.error('Erro ao carregar a denúncia:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDenuncia()
  }, [id])

  const getStatusClass = (status) => {
    const statusMap = {
      'Aberto': styles.statusAberto,
      'Em análise': styles.statusEmAnalise,
      'Concluído': styles.statusConcluido,
      'Urgente': styles.statusUrgente,
    }
    return `${styles.status} ${statusMap[status] || ''}`
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando informações da denúncia...</p>
      </div>
    )
  }

  if (!denuncia) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={48} />
        <h2>Denúncia não encontrada</h2>
        <p>Não foi possível localizar a denúncia com o ID #{id}</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Denúncia #{id}</h1>
        <span className={styles.date}>
          <Clock size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
          {formatDate(denuncia.data)}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <InfoCard title="Informações Gerais">
            <div className={styles.infoGrid}>
              <div>
                <label>Status</label>
                <p><span className={getStatusClass(denuncia.status)}>{denuncia.status}</span></p>
              </div>
              <div>
                <label>Prioridade</label>
                <p>{denuncia.prioridade}</p>
              </div>
              <div>
                <label>Local</label>
                <p>
                  <MapPin size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  {denuncia.local}
                </p>
              </div>
              <div>
                <label>Anônimo</label>
                <p>
                  <Shield size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  {denuncia.anonimo ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Descrição">
            <div className={styles.descricaoContent}>
              <p>{denuncia.descricao}</p>
              
              {denuncia.anexos && denuncia.anexos.length > 0 && (
                <div className={styles.anexosSection}>
                  <h4>Anexos</h4>
                  <div className={styles.anexosList}>
                    {denuncia.anexos.map((anexo, index) => (
                      <div key={index} className={styles.anexoItem}>
                        <span>{anexo.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoCard>
        </div>

        <div className={styles.sidebar}>
          <InfoCard title="Dados do Denunciante">
            <div className={styles.denuncianteInfo}>
              <div className={styles.infoItem}>
                <label>
                  <User size={16} style={{ marginRight: '6px' }} />
                  Nome
                </label>
                <p>{denuncia.nome || 'Não informado'}</p>
              </div>
              <div className={styles.infoItem}>
                <label>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5"></path>
                    <path d="M22 7H2"></path>
                    <path d="m17 15 2 2 4-4"></path>
                  </svg>
                  Email
                </label>
                <p>{denuncia?.email || 'Não informado'}</p>
              </div>
              <div className={styles.infoItem}>
                <label>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Telefone
                </label>
                <p>{denuncia?.telefone || 'Não informado'}</p>
              </div>
              {/* <div className={styles.infoItem}>
                <label>
                  <MapPin size={16} style={{ marginRight: '6px' }} />
                  Local
                </label>
                <p>{denuncia?.local || 'Não informado'}</p>
              </div> */}
            </div>
          </InfoCard>
          
          {!denuncia.anonimo && denuncia.denunciante && (
            <div className={styles.actions}>
              <button className={styles.contactButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 11 18-5v12L3 14v-3z"></path>
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                </svg>
                Contatar Denunciante
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DenunciaDetalhe