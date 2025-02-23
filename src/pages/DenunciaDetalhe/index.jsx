import { useParams } from 'react-router-dom'
import InfoCard from './components/InfoCard'
import Timeline from './components/Timeline'
import styles from './styles.module.css'

const DenunciaDetalhe = () => {
  const { id } = useParams()

  // Dados de exemplo
  const denuncia = {
    id: 1,
    data: '2024-02-23',
    status: 'pendente',
    prioridade: 'alta',
    descricao: 'Descrição detalhada da denúncia...',
    local: 'Rua Exemplo, 123',
    anonimo: true,
    timeline: [
      {
        data: '23/02/2024 15:30',
        descricao: 'Denúncia registrada no sistema',
        usuario: 'Sistema'
      },
      {
        data: '23/02/2024 16:45',
        descricao: 'Iniciado processo de análise',
        usuario: 'Dr. Silva'
      }
    ]
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

        <div className={styles.sidebar}>
          <InfoCard title="Histórico de Ações">
            <Timeline eventos={denuncia.timeline} />
          </InfoCard>
        </div>
      </div>
    </div>
  )
}

export default DenunciaDetalhe