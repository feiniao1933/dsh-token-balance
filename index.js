/**
 * Host half of the token-balance bundle: publishes page-facing options.
 * The Client half owns the balance read and the composer-dock chip.
 */

const DEFAULT_REFRESH_MS = 30_000
const MIN_REFRESH_MS = 5_000
const MAX_REFRESH_MS = 3_600_000

/** Clamp the configured refresh interval to a range the page can poll safely. */
function refreshIntervalOf(config) {
  const value = config?.refreshIntervalMs
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_REFRESH_MS
  return Math.min(MAX_REFRESH_MS, Math.max(MIN_REFRESH_MS, Math.round(value)))
}

export function apply(ctx, config) {
  const refreshIntervalMs = refreshIntervalOf(config)
  ctx.on('webserver/index-inject', (table) => {
    table.push({
      kind: 'global',
      name: '__DSH_TOKEN_BALANCE_CONFIG__',
      value: { refreshIntervalMs },
    })
  })
}
