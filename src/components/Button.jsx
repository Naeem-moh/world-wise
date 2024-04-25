import styles from "./Button.module.css";

export default function Button({ type, onClick, children }) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  );
}
