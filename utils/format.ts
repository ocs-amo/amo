export const zeroPadding = (min: number) => (10 > min ? `0${min}` : min)

export const handlingTab = (key: string) => {
  switch (key) {
    case "activities":
      return 0
    case "images":
      return 1
    case "notifications":
      return 2
    case "members":
      return 3
    default:
      return 0
  }
}
