export const MAX_BASE64_SIZE = 1

export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024)
  return +result.toFixed(decimalsNum)
}

export const getBase64Image = async (image: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
