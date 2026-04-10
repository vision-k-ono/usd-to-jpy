import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import CurrencyInput from './components/CurrencyInput'
import ExchangeResult from './components/ExchangeResult'
import styles from './App.module.css'
const API_URL = 'https://open.er-api.com/v6/latest/USD'

export default function App() {
  const [usdAmount, setUsdAmount] = useState('')
  const [rate, setRate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchRate = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setRate(data.rates.JPY)
      setLastUpdated(
        new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    } catch (err) {
      setError('為替レートの取得に失敗しました。ネットワーク接続を確認してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRate()
  }, [fetchRate])

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <Header />

        <div className={styles.body}>
          <CurrencyInput
            value={usdAmount}
            onChange={setUsdAmount}
            disabled={isLoading}
          />

          <div className={styles.divider} aria-hidden="true">
            <div className={styles.dividerLine} />
            <div className={styles.dividerIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
            <div className={styles.dividerLine} />
          </div>

          <ExchangeResult
            usdAmount={usdAmount}
            rate={rate}
            isLoading={isLoading}
            error={error}
            lastUpdated={lastUpdated}
          />
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={fetchRate}
            disabled={isLoading}
            aria-label="レートを更新"
          >
            <svg
              className={`${styles.refreshIcon} ${isLoading ? styles.spinning : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            レートを更新
          </button>

          <p className={styles.source}>
            データ提供: <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">ExchangeRate-API</a>
          </p>
        </footer>
      </div>
    </main>
  )
}
