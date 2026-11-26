import styles from './preloader.module.css';

export const Preloader = (): React.JSX.Element => (
  <div data-testid="loading" className={styles.preloader}>
    <div className={styles.preloader_circle} />
  </div>
);
