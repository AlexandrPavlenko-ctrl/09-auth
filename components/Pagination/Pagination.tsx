import React from "react";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Генеруємо масив номерів сторінок
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки через тег <a>
    onPageChange(page);
  };

  return (
    <ul className={css.pagination}>
      {/* Кнопка "Назад" */}
      <li
        className={`${css.pageItem} ${currentPage === 1 ? css.disabled : ""}`}
        onClick={(e) => currentPage > 1 && handlePageClick(e, currentPage - 1)}
      >
        <a href="#" className={css.pageLink}>
          &laquo;
        </a>
      </li>

      {/* Список сторінок */}
      {pages.map((page) => (
        <li
          key={page}
          className={`${css.pageItem} ${page === currentPage ? css.active : ""}`}
          onClick={(e) => handlePageClick(e, page)}
        >
          <a href="#" className={css.pageLink}>
            {page}
          </a>
        </li>
      ))}

      {/* Кнопка "Вперед" */}
      <li
        className={`${css.pageItem} ${currentPage === totalPages ? css.disabled : ""}`}
        onClick={(e) =>
          currentPage < totalPages && handlePageClick(e, currentPage + 1)
        }
      >
        <a href="#" className={css.pageLink}>
          &raquo;
        </a>
      </li>
    </ul>
  );
};

export default Pagination;
