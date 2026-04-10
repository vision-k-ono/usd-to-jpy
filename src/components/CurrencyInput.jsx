import { useState, useRef } from 'react'
import styles from './CurrencyInput.module.css'

export default function CurrencyInput({ value, onChange, disabled }) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const raw = e.target.value
    // 数値と小数点のみ許可
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      onChange(raw)
    }
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="usd-input">
        <span className={styles.labelFlag}>🇺🇸</span>
        <span>米ドル (USD) を入力</span>
      </label>

      <div className={`${styles.inputContainer} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}>
        <span className={styles.currencySymbol}>$</span>

        <input
          ref={inputRef}
          id="usd-input"
          type="text"
          inputMode="decimal"
          className={styles.input}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0.00"
          disabled={disabled}
          aria-label="USD金額"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="入力をクリア"
            tabIndex={-1}
          >
            ✕
          </button>
        )}

        <span className={styles.currencyCode}>USD</span>
      </div>

      {value && !isNaN(parseFloat(value)) && (
        <p className={styles.hint}>
          {Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
      )}
    </div>
  )
}
