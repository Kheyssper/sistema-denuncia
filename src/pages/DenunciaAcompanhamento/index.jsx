// src/pages/DenunciaAcompanhamento/index.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Send, User, AlertTriangle, Trash2 } from 'lucide-react'
import styles from './styles.module.css'
import { getDenunciaById, addAcompanhamento, deleteDenuncia } from '../../services/api'

const DenunciaAcompanhamento = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [denuncia, setDenuncia] = useState(null)
  const [novoComentario, setNovoComentario] = useState('')

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

  const handleEnviarAcompanhamento = async () => {
    try {
      await addAcompanhamento(id, novoComentario)
      setNovoComentario('')
      const data = await getDenunciaById(id)
      console.log('Dados da denúncia atualizados:', data)
      setDenuncia(data)
    } catch (error) {
      console.error('Erro ao enviar o acompanhamento:', error)
    }
  }

  const handleDeleteDenuncia = async () => {
    try {
      console.log(`Delete: ${id}`)
      await deleteDenuncia(id)
      console.log('Denúncia deletada com sucesso')
      navigate('/denuncias') // Redireciona para a lista de denúncias após a exclusão
    } catch (error) {
      console.error('Erro ao deletar a denúncia:', error)
    }
  }

  if (!denuncia) {
    return <div>Carregando...</div>
  }

  console.log('Estado atual da denúncia:', denuncia)

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
        <button className={styles.deleteButton} onClick={handleDeleteDenuncia}>
          <Trash2 size={16} />
          Deletar Denúncia
        </button>
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
                <span className={`${styles.priority} ${styles[denuncia.prioridade?.toLowerCase()]}`}>
                  {denuncia.prioridade}
                </span>
              </div>
              <p>{denuncia.descricao}</p>
            </div>
          </div>
          <div className={styles.commentBox}>
            <h3>Adicionar Acompanhamento</h3>
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Digite sua análise ou comentário..."
              className={styles.commentInput}
            />
            <button className={styles.sendButton} onClick={handleEnviarAcompanhamento}>
              <Send size={16} />
              Enviar Acompanhamento
            </button>
          </div>

          <div className={styles.timeline}>
            <h3>Histórico de Acompanhamentos</h3>
            {denuncia.acompanhamentos && denuncia.acompanhamentos.length > 0 ? (
              console.log('Acompanhamentos:', denuncia.acompanhamentos),
              denuncia.acompanhamentos.map((acomp) => (
                <div key={acomp.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot}>
                    <Clock size={16} />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineDate}>
                        {new Date(acomp.created_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>                      <span className={styles.timelineStatus}>{acomp.status}</span>
                    </div>
                    <div className={styles.profissionalInfo}>
                      <User size={14} />
                      <span>{acomp.user.tipo}</span>
                      <span className={styles.profissionalTipo}>{acomp.user.nome}</span>
                    </div>
                    <p className={styles.timelineText}>{acomp.comentario}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Sem acompanhamentos disponíveis.</p>
            )}
          </div>


        </div>
      </div>
    </div>
  )
}

export default DenunciaAcompanhamento