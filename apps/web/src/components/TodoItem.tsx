import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import type { Todo, Priority } from '@/types/todo'
import { format } from 'date-fns'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, text: string) => void
  onChangePriority: (id: string, priority: Priority) => void
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onChangePriority
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      onUpdate(todo.id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />

        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') handleCancel()
                }}
                className="flex-1"
              />
              <Button size="icon" variant="ghost" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div>
              <p className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={priorityColors[todo.priority]} variant="secondary">
                  {todo.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                </span>
                {todo.completedAt && (
                  <span className="text-xs text-muted-foreground">
                    • Completed {format(new Date(todo.completedAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={todo.completed}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}