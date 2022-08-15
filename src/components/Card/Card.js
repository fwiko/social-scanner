import styles from '@styles/components/Card.module.scss';

export default function Card({ children }) {
    return (
        <div className={styles.card}>
            {children}
        </div>
    );
}