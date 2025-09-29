import { useState, useEffect } from 'react'
import { storage } from '@/utils/localStorage'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => storage.get(key, defaultValue))

  useEffect(() => {
    storage.set(key, value)
  }, [key, value])

  return [value, setValue] as const
}