export const STORAGE = {
  ACCOUNT_TAB: 'ACCOUNT_TAB',
  TOKEN_RENTAL_CAR: 'TOKEN_RENTAL_CAR',
  TOKEN_PREFIX: 'TOKEN_PREFIX',
  DISPLAY_NAME: 'DISPLAY_NAME'
}

export const TAB = {
  INFO: 1,
  STATUS: 2,
  HISTORY: 3,
  CARD: 4,
  NAME: true
}

export function getLocalStorage(key: any) {
  return localStorage.getItem(key)
}

export function setLocalStorage(key: any, value: any) {
  return localStorage.setItem(key, value)
}

export function removeLocalStorage(key: any) {
  return localStorage.removeItem(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}
