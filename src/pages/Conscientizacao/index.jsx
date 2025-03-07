import { useEffect, useState } from 'react';
import { BookOpen, FileText, Video, ExternalLink, PlusCircle, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import styles from './styles.module.css';

const RecursoCard = ({ id, titulo, descricao, tipo, link, onEdit, onDelete }) => {
  const iconMap = {
    artigo: FileText,
    video: Video,
    guia: BookOpen,
  };
  const Icon = iconMap[tipo];

  return (
    <div className={styles.recursoCard}>
      <div className={styles.recursoIcon}>
        <Icon size={24} />
      </div>
      <div className={styles.recursoContent}>
        <h3>{titulo}</h3>
        <p>{descricao}</p>
        <a href={link} className={styles.recursoLink}>
          <span>Acessar recurso</span>
          <ExternalLink size={16} />
        </a>
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={() => onEdit(id)}>
            <Edit size={16} />
          </button>
          <button 
            className={`${styles.actionButton} ${styles.deleteButton}`} 
            onClick={() => onDelete(id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Conscientizacao = () => {
  const [recursos, setRecursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecursoId, setCurrentRecursoId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    const loadRecursos = async () => {
      const data = await api.getConscientizacao();
      setRecursos(data);
    };
    loadRecursos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoRecurso = { titulo, descricao, link, tipo };
      if (isEditing) {
        await api.updateRecurso(currentRecursoId, novoRecurso);
      } else {
        await api.addRecurso(novoRecurso);
      }
      const data = await api.getConscientizacao();
      setRecursos(data);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar/editar recurso:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentRecursoId(null);
    setTitulo('');
    setDescricao('');
    setLink('');
    setTipo('');
  };

  const handleEditRecurso = (id) => {
    const recurso = recursos.find((r) => r.id === id);
    setCurrentRecursoId(id);
    setTitulo(recurso.titulo);
    setDescricao(recurso.descricao);
    setLink(recurso.link);
    setTipo(recurso.tipo);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteRecurso = async (id) => {
    try {
      await api.deleteRecurso(id);
      const data = await api.getConscientizacao();
      setRecursos(data);
    } catch (error) {
      console.error('Erro ao deletar recurso:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Central de Conscientização</h1>
          <button className={styles.addButton} onClick={handleOpenModal}>
            <PlusCircle size={20} /> Adicionar Recurso
          </button>
        </div>
        <p>Recursos educativos para prevenção e enfrentamento da violência</p>
      </div>

      <div className={styles.categoryGrid}>
        {recursos.map((recurso) => (
          <RecursoCard
            key={recurso.id}
            {...recurso}
            onEdit={handleEditRecurso}
            onDelete={handleDeleteRecurso}
          />
        ))}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{isEditing ? 'Editar Recurso' : 'Adicionar Recurso'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="titulo">Título</label>
                <input
                  type="text"
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="link">Link</label>
                <input
                  type="url"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="artigo">Artigo</option>
                  <option value="video">Vídeo</option>
                  <option value="guia">Guia</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>{isEditing ? 'Salvar' : 'Adicionar'}</button>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conscientizacao;