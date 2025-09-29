import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'

describe('useTodos', () => {
  it('initializes with empty todo list', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual([])
    expect(result.current.stats.total).toBe(0)
  })

  it('adds a new todo', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Test todo', 'high')
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Test todo')
    expect(result.current.todos[0].priority).toBe('high')
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('toggles todo completion', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Test todo')
    })

    const todoId = result.current.todos[0].id

    act(() => {
      result.current.toggleTodo(todoId)
    })

    expect(result.current.todos[0].completed).toBe(true)
    expect(result.current.todos[0].completedAt).toBeDefined()
  })

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Test todo')
    })

    const todoId = result.current.todos[0].id

    act(() => {
      result.current.deleteTodo(todoId)
    })

    expect(result.current.todos).toHaveLength(0)
  })

  it('updates todo text', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Original text')
    })

    const todoId = result.current.todos[0].id

    act(() => {
      result.current.updateTodo(todoId, 'Updated text')
    })

    expect(result.current.todos[0].text).toBe('Updated text')
  })

  it('changes todo priority', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Test todo', 'low')
    })

    const todoId = result.current.todos[0].id

    act(() => {
      result.current.changePriority(todoId, 'high')
    })

    expect(result.current.todos[0].priority).toBe('high')
  })

  it('clears completed todos', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Todo 1')
      result.current.addTodo('Todo 2')
      result.current.addTodo('Todo 3')
    })

    act(() => {
      result.current.toggleTodo(result.current.todos[0].id)
      result.current.toggleTodo(result.current.todos[2].id)
    })

    act(() => {
      result.current.clearCompleted()
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Todo 2')
  })

  it('filters todos by status', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Active todo')
      result.current.addTodo('Completed todo')
    })

    act(() => {
      result.current.toggleTodo(result.current.todos[1].id)
    })

    act(() => {
      result.current.setFilters({ ...result.current.filters, status: 'active' })
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Active todo')

    act(() => {
      result.current.setFilters({ ...result.current.filters, status: 'completed' })
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Completed todo')
  })

  it('filters todos by search term', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Important task')
      result.current.addTodo('Regular task')
      result.current.addTodo('Important meeting')
    })

    act(() => {
      result.current.setFilters({ ...result.current.filters, searchTerm: 'important' })
    })

    expect(result.current.todos).toHaveLength(2)
  })

  it('calculates stats correctly', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('Task 1', 'high')
      result.current.addTodo('Task 2', 'medium')
      result.current.addTodo('Task 3', 'low')
      result.current.addTodo('Task 4', 'high')
    })

    act(() => {
      result.current.toggleTodo(result.current.todos[0].id)
      result.current.toggleTodo(result.current.todos[2].id)
    })

    expect(result.current.stats.total).toBe(4)
    expect(result.current.stats.completed).toBe(2)
    expect(result.current.stats.active).toBe(2)
    expect(result.current.stats.byPriority.high).toBe(2)
    expect(result.current.stats.byPriority.medium).toBe(1)
    expect(result.current.stats.byPriority.low).toBe(1)
  })
})