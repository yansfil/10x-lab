const STORAGE_PREFIX = 'todo-app-'

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving to localStorage:`, error)
    }
  },

  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
    }
  }
}