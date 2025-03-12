// src/pages/ListaDenuncias/components/FilterBar.jsx
import { Search, Filter, ArrowDownAZ } from 'lucide-react'
import styles from '../styles.module.css'

const FilterBar = ({ onSearch, onFilter, onPriorityFilter }) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchInputContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="search" 
          placeholder="Buscar por ID ou descrição..." 
          className={styles.searchInput}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <div className={styles.filterGroup}>
        <div className={styles.filterContainer}>
          <Filter size={16} className={styles.filterIcon} />
          <select className={styles.filterSelect} onChange={(e) => onFilter(e.target.value)}>
            <option value="">Todos Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="resolvido">Resolvido</option>
          </select>
        </div>
        
        <div className={styles.filterContainer}>
          <ArrowDownAZ size={16} className={styles.filterIcon} />
          <select 
            className={styles.filterSelect}
            onChange={(e) => onPriorityFilter(e.target.value)}
          >
            <option value="">Todas Prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
      </div>
    </div>
  )
}
export default FilterBar;