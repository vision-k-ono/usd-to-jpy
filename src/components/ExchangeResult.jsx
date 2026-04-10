import { useEffect, useRef, useState } from 'react'
import styles from './ExchangeResult.module.css'

function useCountUp(target, duration = 500) {
  const [displayed, setDisplayed] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target

    if (from === to) return

    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(from + (to - from) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayed(to)
        prevRef.current = to
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return displayed
}

export default function ExchangeResult({ usdAmount, rate, isLoading, error, lastUpdated }) {
  const jpyValue = usdAmount && rate ? parseFloat(usdAmount) * rate : 0
  const animatedJpy = useCountUp(jpyValue)

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <span className={styles.labelFlag}>🇯🇵</span>
          <span>日本円 (JPY)</span>
        </div>
        <div className={styles.skeleton}>
          <div className={`${styles.skeletonBar} ${styles.skeletonLarge}`} />
          <div className={`${styles.skeletonBar} ${styles.skeletonSmall}`} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <span className={styles.labelFlag}>🇯🇵</span>
          <span>日本円 (JPY)</span>
        </div>
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>⚠</span>
          <div>
            <p className={styles.errorTitle}>レート取得エラー</p>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const hasAmount = usdAmount && !isNaN(parseFloat(usdAmount)) && parseFloat(usdAmount) > 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <span className={styles.labelFlag}>🇯🇵</span>
        <span>日本円 (JPY)</span>
      </div>

      <div className={`${styles.resultBox} ${hasAmount ? styles.active : ''}`}>
        <div className={styles.resultAmount}>
          <span className={styles.yenSymbol}>¥</span>
          <span className={styles.amount}>
            {hasAmount
              ? Math.round(animatedJpy).toLocaleString('ja-JP')
              : '—'}
          </span>
        </div>

        {hasAmount && (
          <p className={styles.amountLabel}>
            {Math.round(animatedJpy).toLocaleString('ja-JP')} 円
          </p>
        )}
      </div>

      <div className={styles.rateInfo}>
        {rate ? (
          <>
            <div className={styles.rateChip}>
              <span className={styles.rateDot} />
              <span>1 USD = <strong>{rate.toLocaleString('ja-JP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> JPY</span>
            </div>
            {lastUpdated && (
              <span className={styles.updatedAt}>
                取得: {lastUpdated}
              </span>
            )}
          </>
        ) : (
          <span className={styles.rateLoading}>レートを読み込み中...</span>
        )}
      </div>
    </div>
  )
}
