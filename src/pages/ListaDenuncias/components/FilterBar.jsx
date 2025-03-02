// src/pages/ListaDenuncias/components/FilterBar.jsx
import styles from '../styles.module.css'

const FilterBar = ({ onSearch, onFilter }) => {
  const handlePriorityFilter = (value) => {
    // Esta função pode ser implementada conforme necessário
    console.log('Filtro de prioridade:', value);
  };

  return (
    <div className={styles.filterBar}>
      <input 
        type="search" 
        placeholder="Buscar denúncia..." 
        className={styles.searchInput}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select className={styles.filterSelect} onChange={(e) => onFilter(e.target.value)}>
        <option value="">Todos Status</option>
        <option value="pendente">Pendente</option>
        <option value="em_analise">Em Análise</option>
        <option value="resolvido">Resolvido</option>
      </select>
      <select 
        className={styles.filterSelect}
        onChange={(e) => handlePriorityFilter(e.target.value)}
      >
        <option value="">Todas Prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>
    </div>
  )
}
export default FilterBar;