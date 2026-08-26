import { useEffect, type PropsWithChildren } from "react";
import styles from "./Modal.module.css";
interface Props extends PropsWithChildren {
  title: string;
  onClose: () => void;
}
export function Modal({ title, onClose, children }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
