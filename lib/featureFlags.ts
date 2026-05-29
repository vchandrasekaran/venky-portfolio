function isTruthy(value: string | undefined) {
  if (!value) return false
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
}

export function publicDemosEnabled() {
  return isTruthy(process.env.ENABLE_PUBLIC_DEMOS) || isTruthy(process.env.NEXT_PUBLIC_ENABLE_LIVE_DEMOS)
}
