import React from 'react';
import PropTypes from 'prop-types';
import { CPagination, CPaginationItem } from '@coreui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages < 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <CPagination size="sm" aria-label="Page navigation">
      <CPaginationItem onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        First
      </CPaginationItem>

      <CPaginationItem onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        &lt;
      </CPaginationItem>

      {pages.map((page) => (
        <CPaginationItem
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </CPaginationItem>
      ))}

      <CPaginationItem onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        &gt;
      </CPaginationItem>

      <CPaginationItem onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        Last
      </CPaginationItem>
    </CPagination>
  );
};
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
