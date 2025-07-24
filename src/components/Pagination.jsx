import React from 'react';
import '../css/Pagination.css'; // Asegúrate de importar el CSS

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        ← Anterior
      </button>
      <span className="pagination-page">{`Página ${currentPage} de ${totalPages}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Siguiente →
      </button>
    </div>
  );
}

export default Pagination;
