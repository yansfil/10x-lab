import { Card } from '@/components/ui/card'
import type { TodoStats as TodoStatsType } from '@/types/todo'
import { CheckCircle2, Circle, ListTodo } from 'lucide-react'

interface TodoStatsProps {
  stats: TodoStatsType
}

export function TodoStats({ stats }: TodoStatsProps) {
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <ListTodo className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Circle className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div>
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="text-2xl font-bold">{completionRate}%</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 md:col-span-4">
        <p className="text-sm text-muted-foreground mb-2">Tasks by Priority</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-sm">High: {stats.byPriority.high}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-sm">Medium: {stats.byPriority.medium}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-sm">Low: {stats.byPriority.low}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}