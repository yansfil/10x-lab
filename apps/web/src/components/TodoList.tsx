import { TodoItem } from './TodoItem'
import type { Todo, Priority } from '@/types/todo'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, text: string) => void
  onChangePriority: (id: string, priority: Priority) => void
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  onChangePriority
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tasks found. Add one above to get started!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onChangePriority={onChangePriority}
        />
      ))}
    </div>
  )
}