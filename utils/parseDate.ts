export const getRelativeDays = (_date: string) => {
  const date = new Date(_date)
  const diffMs = date.getTime() - Date.now()
  const daysElapsed = Math.round(diffMs / (1000*60*60*24))
  if (daysElapsed === 0) return "Today"
  const formatter = new Intl.RelativeTimeFormat("en")
  const res = formatter.format(daysElapsed, "days")
  return res
}