// src/pages/DenunciaAcompanhamento/index.jsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, Send, User, AlertTriangle } from 'lucide-react'
import styles from './styles.module.css'

const DenunciaAcompanhamento = () => {
  const { id } = useParams()
  const [novoComentario, setNovoComentario] = useState('')

  useEffect(() => {
    const loadDenuncia = async () => {
      const data = await getDenunciaById(id);
      setDenuncia(data);
    };
    loadDenuncia();
  }, [id]);

  const denuncia = {
    id: "123",
    data: "23/02/2024",
    status: "Em Análise",
    descricao: "Descrição detalhada da denúncia que precisa de acompanhamento...",
    prioridade: "Alta",
    acompanhamentos: [
      {
        id: 1,
        data: "23/02/2024 15:30",
        profissional: "Dr. Silva",
        tipo: "Psicólogo",
        comentario: "Primeira análise realizada. Caso requer atenção imediata.",
        status: "Iniciado"
      },
      {
        id: 2,
        data: "23/02/2024 16:45",
        profissional: "Dra. Ana",
        tipo: "Advogada",
        comentario: "Documentação necessária solicitada.",
        status: "Em Andamento"
      }
    ]
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Acompanhamento da Denúncia #{id}</h1>
          <span className={styles.date}>Registrada em {denuncia.data}</span>
        </div>
        <div className={styles.statusBadge}>
          {denuncia.status}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <AlertTriangle size={20} />
              <h3>Detalhes da Denúncia</h3>
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoRow}>
                <span>Prioridade:</span>
                <span className={`${styles.priority} ${styles[denuncia.prioridade.toLowerCase()]}`}>
                  {denuncia.prioridade}
                </span>
              </div>
              <p>{denuncia.descricao}</p>
            </div>
          </div>

          <div className={styles.timeline}>
            <h3>Histórico de Acompanhamentos</h3>
            {denuncia.acompanhamentos.map((acomp) => (
              <div key={acomp.id} className={styles.timelineItem}>
                <div className={styles.timelineDot}>
                  <Clock size={16} />
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineDate}>{acomp.data}</span>
                    <span className={styles.timelineStatus}>{acomp.status}</span>
                  </div>
                  <div className={styles.profissionalInfo}>
                    <User size={14} />
                    <span>{acomp.profissional}</span>
                    <span className={styles.profissionalTipo}>{acomp.tipo}</span>
                  </div>
                  <p className={styles.timelineText}>{acomp.comentario}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.commentBox}>
            <h3>Adicionar Acompanhamento</h3>
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Digite sua análise ou comentário..."
              className={styles.commentInput}
            />
            <button className={styles.sendButton}>
              <Send size={16} />
              Enviar Acompanhamento
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DenunciaAcompanhamento