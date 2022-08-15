import styles from '@styles/components/Form.module.scss';

import Button from '@components/Button/Button';

export default function Form({ children, onSubmit }) {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {children}
            <Button>Check Username</Button>
        </form>
    );
}