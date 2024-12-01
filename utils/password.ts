import CryptoJS from "crypto-js"

/**
 * パスワードをハッシュ化する関数
 */
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)
}

/**
 * パスワードが一致するかどうかを比較する関数
 */
export const comparePassword = (
  inputPassword: string,
  storedHash: string,
): boolean => {
  const hashedInputPassword = hashPassword(inputPassword)
  return hashedInputPassword === storedHash
}
