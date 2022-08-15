import styles from '@styles/components/Button.module.scss'

export default function Button({ onClick, children }) {
    return (
        <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={onClick}>
            {children}
        </button>
    )
}