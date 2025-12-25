// import React from 'react';
// import PropTypes from 'prop-types';
// import { CPagination, CPaginationItem } from '@coreui/react';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   if (totalPages < 1) return null;

//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <CPagination size="sm" aria-label="Page navigation">
//       <CPaginationItem onClick={() => onPageChange(1)} disabled={currentPage === 1}>
//         First
//       </CPaginationItem>

//       <CPaginationItem onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
//         &lt;
//       </CPaginationItem>

//       {pages.map((page) => (
//         <CPaginationItem
//           key={page}
//           active={page === currentPage}
//           onClick={() => onPageChange(page)}
//         >
//           {page}
//         </CPaginationItem>
//       ))}

//       <CPaginationItem onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//         &gt;
//       </CPaginationItem>

//       <CPaginationItem onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
//         Last
//       </CPaginationItem>
//     </CPagination>
//   );
// };
// Pagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
// };

// export default Pagination;





import React from 'react';
import PropTypes from 'prop-types';
import { CPagination, CPaginationItem } from '@coreui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Number of page numbers to show at a time
  const pageNeighbors = 1; // Shows 2-3 pages depending on position
  const maxPagesToShow = 3; // Show 3 page numbers at most

  // Calculate range of pages to display
  const calculatePageRange = () => {
    let startPage, endPage;
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages based on current page
      const halfMaxPages = Math.floor(maxPagesToShow / 2);
      
      if (currentPage <= halfMaxPages) {
        // Near the beginning
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + halfMaxPages >= totalPages) {
        // Near the end
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // In the middle
        startPage = currentPage - halfMaxPages;
        endPage = currentPage + halfMaxPages;
      }
    }
    
    return { startPage, endPage };
  };

  const { startPage, endPage } = calculatePageRange();
  
  // Create array of page numbers to display
  const pageRange = [];
  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  return (
    <CPagination size="sm" aria-label="Page navigation">
      {/* First page button */}
      <CPaginationItem 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        aria-label="First page"
      >
        First
      </CPaginationItem>

      {/* Previous page button */}
      <CPaginationItem 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &lt;
      </CPaginationItem>

      {/* Show ellipsis before page numbers if needed */}
      {startPage > 1 && (
        <CPaginationItem disabled>...</CPaginationItem>
      )}

      {/* Page number buttons */}
      {pageRange.map((page) => (
        <CPaginationItem
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </CPaginationItem>
      ))}

      {/* Show ellipsis after page numbers if needed */}
      {endPage < totalPages && (
        <CPaginationItem disabled>...</CPaginationItem>
      )}

      {/* Next page button */}
      <CPaginationItem 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &gt;
      </CPaginationItem>

      {/* Last page button */}
      <CPaginationItem 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
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