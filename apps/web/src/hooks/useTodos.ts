import { useState, useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Todo, TodoFilters, TodoStats, Priority } from '@/types/todo'

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
    searchTerm: ''
  })

  const addTodo = useCallback((text: string, priority: Priority = 'medium') => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    }
    setTodos(prev => [newTodo, ...prev])
  }, [setTodos])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined
          }
        : todo
    ))
  }, [setTodos])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [setTodos])

  const updateTodo = useCallback((id: string, text: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ))
  }, [setTodos])

  const changePriority = useCallback((id: string, priority: Priority) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ))
  }, [setTodos])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }, [setTodos])

  const filteredTodos = useMemo(() => {
    let result = [...todos]

    if (filters.status !== 'all') {
      result = result.filter(todo =>
        filters.status === 'completed' ? todo.completed : !todo.completed
      )
    }

    if (filters.priority !== 'all') {
      result = result.filter(todo => todo.priority === filters.priority)
    }

    if (filters.searchTerm) {
      result = result.filter(todo =>
        todo.text.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    return result
  }, [todos, filters])

  const stats: TodoStats = useMemo(() => {
    const completed = todos.filter(t => t.completed).length
    const byPriority = todos.reduce((acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1
      return acc
    }, {} as Record<Priority, number>)

    return {
      total: todos.length,
      completed,
      active: todos.length - completed,
      byPriority: {
        low: byPriority.low || 0,
        medium: byPriority.medium || 0,
        high: byPriority.high || 0
      }
    }
  }, [todos])

  return {
    todos: filteredTodos,
    filters,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    changePriority,
    clearCompleted,
    setFilters
  }
}