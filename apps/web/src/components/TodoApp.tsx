import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TodoInput } from './TodoInput'
import { TodoList } from './TodoList'
import { TodoStats } from './TodoStats'
import { useTodos } from '@/hooks/useTodos'
import { Search, Filter, Trash2 } from 'lucide-react'

export function TodoApp() {
  const {
    todos,
    filters,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    changePriority,
    clearCompleted,
    setFilters
  } = useTodos()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </div>

        <TodoStats stats={stats} />

        <Card className="mt-6 p-6">
          <TodoInput onAdd={addTodo} />

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="pl-10"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {stats.completed > 0 && (
              <Button
                onClick={clearCompleted}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Completed
              </Button>
            )}
          </div>

          <div className="mt-6">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onChangePriority={changePriority}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}