import styles from '@styles/components/Card.module.scss';

export default function ResultCard({ title, mode, link }) {
    let cardStyle;
    switch (mode) {
        case 'available':
            cardStyle = styles['card-result-available'];
            break;
        case 'unavailable':
            cardStyle = styles['card-result-unavailable'];
            break;
        default:
            cardStyle = styles['card-result-neutral'];
    }

    return (
        <a href={link} className={`${styles.card} ${styles['card-result']} ${cardStyle}`} target="_blank" rel="noreferrer">
            <h2 className="t-clr-light">{title}</h2>
            <p className="t-clr-light-secondary">{mode != 'errored' ? mode.toUpperCase() : 'UNKNOWN'}</p>
        </a>
    );
}