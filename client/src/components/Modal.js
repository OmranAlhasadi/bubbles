import styles from "../css/Modal.module.css";

function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`${styles.modalBackdrop} ${open ? styles.visible : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${styles.modalContent} ${open ? styles.scale100 : ""}`}
      >
        <button onClick={onClose} className={styles.closeButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
