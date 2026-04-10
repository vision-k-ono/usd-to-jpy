import styles from './Header.module.css'

export default function Header() {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <header className={styles.header}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon} aria-hidden="true">💱</span>
      </div>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>USD</span>
          <span className={styles.titleArrow}>→</span>
          <span className={styles.titleAccent}>JPY</span>
        </h1>
        <p className={styles.subtitle}>リアルタイム為替換算</p>
      </div>
      <time className={styles.date} dateTime={new Date().toISOString().split('T')[0]}>
        {today}
      </time>
    </header>
  )
}
