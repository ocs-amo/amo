export const randomInteger = (max: number) => {
  const num = Math.random() * (max + 1)
  const numInt = Math.trunc(num)

  return numInt
}
