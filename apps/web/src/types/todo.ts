export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  createdAt: string
  completedAt?: string
}

export interface TodoFilters {
  status: 'all' | 'active' | 'completed'
  priority: Priority | 'all'
  searchTerm: string
}

export interface TodoStats {
  total: number
  completed: number
  active: number
  byPriority: Record<Priority, number>
}