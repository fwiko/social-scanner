import styles from '@styles/components/Grid.module.scss';

export default function Grid({ children, className, columns }) {
    return (
        <div className={`${styles.grid} ${styles[`grid-cols-${columns}`]}`}>
            {children}
        </div>
    )
}