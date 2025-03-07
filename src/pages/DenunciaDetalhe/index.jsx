import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import InfoCard from './components/InfoCard'
import Timeline from './components/Timeline'
import styles from './styles.module.css'
import { getDenunciaById } from '../../services/api'

const DenunciaDetalhe = () => {
  const { id } = useParams()
  const [denuncia, setDenuncia] = useState(null)

  useEffect(() => {
    const loadDenuncia = async () => {
      try {
        const data = await getDenunciaById(id)
        setDenuncia(data)
      } catch (error) {
        console.error('Erro ao carregar a denúncia:', error)
      }
    }
    loadDenuncia()
  }, [id])

  if (!denuncia) {
    return <div>Carregando...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Denúncia #{id}</h1>
        <span className={styles.date}>{denuncia.data}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <InfoCard title="Informações Gerais">
            <div className={styles.infoGrid}>
              <div>
                <label>Status</label>
                <p>{denuncia.status}</p>
              </div>
              <div>
                <label>Prioridade</label>
                <p>{denuncia.prioridade}</p>
              </div>
              <div>
                <label>Local</label>
                <p>{denuncia.local}</p>
              </div>
              <div>
                <label>Anônimo</label>
                <p>{denuncia.anonimo ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Descrição">
            <p>{denuncia.descricao}</p>
          </InfoCard>
        </div>

        {/* <div className={styles.sidebar}>
          <InfoCard title="Histórico de Ações">
            <Timeline eventos={denuncia.timeline || []} />
          </InfoCard>
        </div> */}
      </div>
    </div>
  )
}

export default DenunciaDetalhe