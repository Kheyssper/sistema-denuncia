import { useEffect, useState } from 'react';
import { BookOpen, FileText, Video, ExternalLink } from 'lucide-react';
import styles from './styles.module.css';

const RecursoCard = ({ titulo, descricao, tipo, link }) => {
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
      </div>
    </div>
  );
};

const Conscientizacao = () => {
  const [recursos, setRecursos] = useState([
    {
      id: 1,
      tipo: 'artigo',
      titulo: 'Como Identificar Sinais de Violência',
      descricao: 'Guia completo sobre os diferentes tipos de violência e como identificá-los.',
      link: '#',
    },
    {
      id: 2,
      tipo: 'video',
      titulo: 'Direitos da Vítima',
      descricao: 'Vídeo explicativo sobre os direitos legais das vítimas de violência.',
      link: '#',
    },
    {
      id: 3,
      tipo: 'guia',
      titulo: 'Passo a Passo para Denunciar',
      descricao: 'Manual prático sobre como realizar uma denúncia de forma segura.',
      link: '#',
    },
  ]);

  useEffect(() => {
    const loadRecursos = async () => {
      const data = await api.getConscientizacao();
      setRecursos(data);
    };
    loadRecursos();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Central de Conscientização</h1>
        <p>Recursos educativos para prevenção e enfrentamento da violência</p>
      </div>

      <div className={styles.categoryGrid}>
        {recursos.map((recurso) => (
          <RecursoCard key={recurso.id} {...recurso} />
        ))}
      </div>
    </div>
  );
};

export default Conscientizacao;