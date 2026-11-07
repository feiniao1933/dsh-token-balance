window.__ModuleLoader__.load({
  id: 'dsh-token-balance',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NAMESPACE = 'dsh.tokenBalance'
    const CONFIG_GLOBAL = '__DSH_TOKEN_BALANCE_CONFIG__'
    const FALLBACK_REFRESH_MS = 30_000
    const MIN_REFRESH_MS = 5_000
    const MAX_REFRESH_MS = 3_600_000

    const DICTIONARIES = {
      en: {
        label: 'DeepSeek balance',
        total: 'Total balance',
        balance: 'Recharge balance',
        bonus: 'Bonus balance',
        loadingHint: 'The account balance is being read.',
        signedOut: 'Not signed in',
        signedOutHint: 'Sign in from Settings → Account to see the balance. Click to retry.',
        unavailable: 'Balance unavailable',
        errorHint: 'The balance could not be read. Click to retry.',
        updated: 'Updated {time}',
        refreshHint: 'Click to refresh',
        staleHint: 'The last refresh failed; showing the previous value.',
      },
      zh: {
        label: 'DeepSeek 余额',
        total: '总余额',
        balance: '充值余额',
        bonus: '赠送余额',
        loadingHint: '正在读取账户余额。',
        signedOut: '未登录',
        signedOutHint: '在 设置 → 账户 中登录后可查看余额。点击可重试。',
        unavailable: '余额不可用',
        errorHint: '无法读取余额。点击重试。',
        updated: '{time} 更新',
        refreshHint: '点击刷新',
        staleHint: '最近一次刷新失败，显示的是上次读取的值。',
      },
    }

    const STYLE_ID = 'dsh-token-balance/styles'
    const CSS = `
.dsh-tb-chip{box-sizing:border-box;display:inline-flex;align-items:center;gap:6px;max-width:100%;min-width:0;padding:1px 8px;border:none;border-radius:var(--dsw-radius-sm);background:0 0;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:calc(var(--dsh-content-font-size-secondary,13px) - 1px);font-variant-numeric:tabular-nums;line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));white-space:nowrap;cursor:pointer}
@media (hover:hover){.dsh-tb-chip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}}
.dsh-tb-chip:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dsh-tb-chip[data-state=error]{color:var(--dsw-alias-state-error-primary)}
.dsh-tb-icon{display:grid;place-items:center;width:14px;height:14px;flex:none}
.dsh-tb-value{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-tb-dot{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-state-warn-primary);flex:none}
`

    const CURRENCY_SYMBOLS = { CNY: '¥', USD: '$' }

    /** Group thousands without depending on the page locale. */
    function groupDigits(text) {
      return text.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    /** Truncate a positive amount to cents, as Platform Web does for balances. */
    function truncateCents(amount) {
      const cents = Math.floor(Number((amount * 100).toFixed(6)))
      const whole = groupDigits(String(Math.floor(cents / 100)))
      return `${whole}.${String(cents % 100).padStart(2, '0')}`
    }

    /** Format one wallet amount, keeping the sub-cent and negative display rules. */
    function formatAmount(raw, symbol) {
      const amount = Number(raw)
      if (!Number.isFinite(amount)) return `${symbol}--`
      if (amount === 0) return `${symbol}0.00`
      if (amount < 0) {
        const magnitude = Math.abs(amount)
        return `-${symbol}${magnitude < 0.01 ? '0.01' : truncateCents(magnitude)}`
      }
      if (amount < 0.01) return `<${symbol}0.01`
      return `${symbol}${truncateCents(amount)}`
    }

    function formatWallets(wallets) {
      if (wallets.length === 0) return ''
      return wallets
        .map((wallet) => formatAmount(wallet.balance, CURRENCY_SYMBOLS[wallet.currency] ?? ''))
        .join(' + ')
    }

    /** Recharge and bonus wallets share a currency but are reported separately. */
    function totalWallets(wallets, bonus) {
      const totals = new Map()
      for (const wallet of [...wallets, ...bonus]) {
        const currency = wallet.currency
        const amount = Number(wallet.balance)
        if (!Number.isFinite(amount)) continue
        totals.set(currency, (totals.get(currency) ?? 0) + amount)
      }
      return [...totals].map(([currency, amount]) => ({ currency, balance: String(amount) }))
    }

    function configuredRefreshInterval() {
      const value = globalThis[CONFIG_GLOBAL]?.refreshIntervalMs
      if (typeof value !== 'number' || !Number.isFinite(value)) return FALLBACK_REFRESH_MS
      return Math.min(MAX_REFRESH_MS, Math.max(MIN_REFRESH_MS, Math.round(value)))
    }

    /** Client build version reported with account reads; Platform only records it. */
    function clientVersion() {
      const version = globalThis.__DSH_BOOT__?.release?.version
      return typeof version === 'string' && version !== '' ? version : '0.0.0'
    }

    function installStyles() {
      if (typeof document === 'undefined') return () => {}
      const selector = `style[data-plugin-css="${STYLE_ID}"]`
      if (document.querySelector(selector) !== null) return () => {}
      const tag = document.createElement('style')
      tag.dataset.plugin = 'dsh-token-balance'
      tag.dataset.pluginCss = STYLE_ID
      tag.textContent = CSS
      document.head.appendChild(tag)
      return () => tag.remove()
    }

    function BalanceIcon() {
      return h(
        'svg',
        { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': true, focusable: 'false' },
        h('circle', { cx: 8, cy: 8, r: 5.6, fill: 'none', stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', {
          d: 'M5.9 5.2 8 7.9 10.1 5.2M8 7.9v3.6M6.2 8.6h3.6M6.2 10.2h3.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.1,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    const INITIAL_STATE = {
      status: 'loading',
      wallets: [],
      bonus: [],
      updatedAt: 0,
      stale: false,
      reason: '',
      message: '',
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NAMESPACE, DICTIONARIES), 'token-balance: dictionaries')
        ctx.effect(installStyles, 'token-balance: styles')

        const t = ctx.locale.bind(NAMESPACE)
        const refreshIntervalMs = configuredRefreshInterval()

        const accountClient = () => ({
          version: clientVersion(),
          locale: ctx.locale.getSnapshot().active,
          timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
        })

        const timeText = (timestamp) => {
          try {
            return new Date(timestamp).toLocaleTimeString(ctx.locale.getSnapshot().active, { hour12: false })
          } catch {
            return new Date(timestamp).toLocaleTimeString()
          }
        }

        /**
         * One live balance chip. It re-reads the account on mount, on an interval
         * while the tab is visible, when the tab regains focus, when a turn in
         * this Session finishes, and on click.
         */
        function BalanceChip({ sessionId, useSessionStatus }) {
          const [state, setState] = React.useState(INITIAL_STATE)
          React.useSyncExternalStore(
            (callback) => ctx.locale.subscribe(callback),
            () => ctx.locale.getSnapshot(),
          )

          const aliveRef = React.useRef(true)
          const inflightRef = React.useRef(undefined)
          React.useEffect(
            () => () => {
              aliveRef.current = false
            },
            [],
          )

          const read = React.useCallback(() => {
            if (inflightRef.current !== undefined) return inflightRef.current
            const request = (async () => {
              let next
              try {
                const account = ctx.get?.('remote.account')
                if (account === undefined) throw new Error('account Remote is unavailable')
                const result = await account.getBalance(accountClient())
                if (result?.ok !== true) {
                  next = {
                    status: 'failed',
                    reason: 'remote-failed',
                    message: String(result?.error?.message ?? result?.message ?? 'Remote call failed'),
                  }
                } else if (result.value === null) {
                  next = { status: 'signedOut', reason: 'signed-out', message: '' }
                } else if (result.value?.status !== 'ready') {
                  next = {
                    status: 'failed',
                    reason: 'host-failed',
                    message: 'the Host reported a failed balance read',
                  }
                } else {
                  next = {
                    status: 'ready',
                    wallets: Array.isArray(result.value.value) ? result.value.value : [],
                    bonus: Array.isArray(result.value.bonusWallets) ? result.value.bonusWallets : [],
                    reason: '',
                    message: '',
                  }
                }
              } catch (error) {
                const message = String(error?.message ?? error)
                console.error('[token-balance] balance read failed', { message })
                next = { status: 'failed', reason: 'exception', message }
              }
              if (!aliveRef.current) return
              setState((previous) => {
                if (next.status === 'ready') return { ...next, updatedAt: Date.now(), stale: false }
                if (next.status === 'failed' && previous.status === 'ready') {
                  return { ...previous, stale: true, reason: next.reason, message: next.message }
                }
                return {
                  status: next.status,
                  wallets: [],
                  bonus: [],
                  updatedAt: 0,
                  stale: false,
                  reason: next.reason ?? '',
                  message: next.message ?? '',
                }
              })
            })()
            inflightRef.current = request
            request.finally(() => {
              if (inflightRef.current === request) inflightRef.current = undefined
            })
            return request
          }, [])

          React.useEffect(() => {
            read()
            const timer = window.setInterval(() => {
              if (document.visibilityState === 'visible') read()
            }, refreshIntervalMs)
            const refreshIfVisible = () => {
              if (document.visibilityState === 'visible') read()
            }
            document.addEventListener('visibilitychange', refreshIfVisible)
            window.addEventListener('focus', refreshIfVisible)
            return () => {
              window.clearInterval(timer)
              document.removeEventListener('visibilitychange', refreshIfVisible)
              window.removeEventListener('focus', refreshIfVisible)
            }
          }, [read])

          const running = useSessionStatus((statuses) =>
            sessionId === undefined ? false : statuses.get(sessionId)?.running === true,
          )
          const wasRunningRef = React.useRef(running)
          React.useEffect(() => {
            if (wasRunningRef.current && !running) read()
            wasRunningRef.current = running
          }, [running, read])

          const failureCountRef = React.useRef(0)
          React.useEffect(() => {
            if (state.status !== 'failed') {
              failureCountRef.current = 0
              return
            }
            if (failureCountRef.current >= 3) return
            const timer = window.setTimeout(() => {
              failureCountRef.current += 1
              read()
            }, 3000)
            return () => window.clearTimeout(timer)
          }, [state, read])

          const status = state.status

          const dataState =
            status === 'ready' ? 'ready' : status === 'loading' ? 'loading' : status === 'signedOut' ? 'signedOut' : 'error'

          const total = status === 'ready' ? totalWallets(state.wallets, state.bonus) : []
          let valueText
          if (status === 'ready') valueText = formatWallets(total) || '--'
          else if (status === 'loading') valueText = '…'
          else if (status === 'signedOut') valueText = t('signedOut')
          else valueText = t('unavailable')

          let title
          if (status === 'ready') {
            const lines = [`${t('total')}: ${formatWallets(total) || '--'}`]
            if (state.wallets.length > 0) lines.push(`${t('balance')}: ${formatWallets(state.wallets)}`)
            if (state.bonus.length > 0) lines.push(`${t('bonus')}: ${formatWallets(state.bonus)}`)
            if (state.updatedAt > 0) {
              lines.push(`${t('updated', { time: timeText(state.updatedAt) })} · ${t('refreshHint')}`)
            }
            if (state.stale) lines.push(t('staleHint'))
            title = lines.join('\n')
          } else if (status === 'loading') title = t('loadingHint')
          else if (status === 'signedOut') title = `${t('signedOut')} · ${t('signedOutHint')}`
          else title = state.message ? `${t('errorHint')}\n${state.message}` : t('errorHint')

          const ariaLabel = status === 'ready' ? `${t('label')}: ${valueText}` : `${t('label')}: ${title}`

          return h(
            'button',
            {
              type: 'button',
              className: 'dsh-tb-chip',
              'data-state': dataState,
              'data-stale': state.stale ? 'true' : undefined,
              title,
              'aria-label': ariaLabel,
              onClick: () => {
                read()
              },
            },
            h('span', { className: 'dsh-tb-icon', key: 'icon' }, h(BalanceIcon)),
            h('span', { className: 'dsh-tb-value', key: 'value' }, valueText),
            state.stale ? h('span', { className: 'dsh-tb-dot', key: 'dot', 'aria-hidden': true }) : null,
          )
        }

        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'token-balance',
              order: 2,
              label: () => t('label'),
            },
            BalanceChip,
          ),
        )
      },
    }
  },
})
