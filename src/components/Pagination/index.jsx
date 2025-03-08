// src/components/Pagination/index.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './styles.module.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems,
  itemsPerPage 
}) => {
  // Função para gerar a lista de páginas a serem exibidas
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Mostrar no máximo 5 números de página
    
    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for menor que o máximo, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostra sempre a primeira página
      pageNumbers.push(1);
      
      // Calcula o início e fim do intervalo de páginas a mostrar
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajusta para mostrar sempre 3 páginas (ou o máximo possível)
      if (end - start < 2) {
        if (start === 2) {
          end = Math.min(4, totalPages - 1);
        } else {
          start = Math.max(2, totalPages - 3);
        }
      }
      
      // Adiciona reticências se necessário
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Adiciona as páginas do intervalo
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Adiciona reticências se necessário
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Sempre mostra a última página
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Se não houver páginas, não renderiza o componente
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Mostrando {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} a {Math.min(itemsPerPage * currentPage, totalItems)} de {totalItems} registros
      </div>
      
      <div className={styles.paginationControls}>
        <button 
          className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          <span className={styles.buttonText}>Anterior</span>
        </button>
        
        <div className={styles.pageNumbers}>
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={styles.ellipsis}>...</span>
              ) : (
                <button
                  className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <button 
          className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className={styles.buttonText}>Próxima</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;