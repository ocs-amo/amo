export const zeroPadding = (min: number) => (10 > min ? `0${min}` : min)

export const displayTime = (date: Date) =>
  `${date.getHours()}:${zeroPadding(date.getMinutes())}`

export const parseFullDate = (date: Date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${zeroPadding(date.getHours())}:${zeroPadding(date.getMinutes())}`

export const parseDate = (date: Date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

export const parseMonthDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}`

export const handlingTab = (key: string) => {
  switch (key) {
    case "activities":
      return 0
    case "album":
      return 1
    case "notifications":
      return 2
    case "members":
      return 3
    default:
      return 0
  }
}

export const getDayColor = (day: number) => {
  if (day === 0) return "red" // 日曜日
  if (day === 6) return "blue" // 土曜日
  return "black"
}
