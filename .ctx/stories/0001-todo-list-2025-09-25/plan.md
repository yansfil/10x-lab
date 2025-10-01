# Implementation Plan: Todo List Application
**Date**: 2025-09-25
**Overview**: [./overview.md](./overview.md)
**Spec**: [./spec.md](./spec.md)
**Story**: `.ctx/stories/20250925-todo-list/`

**IMPORTANT**: This plan provides detailed, step-by-step implementation instructions for building a client-side todo list application with React, Vite, TypeScript, and shadcn/ui components, using localStorage for persistence.

## 1. Overview
Building a modern todo list application that runs entirely in the browser, providing users with a simple yet robust task management tool. The application will feature full CRUD operations, visual task completion tracking, and automatic persistence using browser localStorage, all wrapped in an accessible and responsive interface.

## 2. Requirements & Clarifications

### 2.1 Scope
- **In-scope**:
  - Monorepo structure setup (for future server addition)
  - React + Vite + TypeScript application
  - Todo CRUD operations (Create, Read, Update, Delete)
  - localStorage persistence
  - shadcn/ui component integration
  - Responsive design
  - Accessibility (WCAG 2.1 Level AA)
  - Unit and integration tests with Vitest

- **Out-of-scope**:
  - Server-side functionality
  - User authentication
  - Multiple todo lists
  - Categories, tags, priorities
  - Data export/import
  - Drag-and-drop reordering

- **Impact**:
  - New application setup
  - No existing code affected (greenfield project)

### 2.2 Clarifications from Spec
- **Resolved Clarifications**:
  - [#001]: Project structure → Use monorepo structure for future server addition → Will use `apps/web` for client
  - [#002]: shadcn/ui setup → Use CLI installation → Provides better component management
  - [#003]: Icon library → Lucide React → Integrates well with shadcn/ui
  - [#004]: Component architecture → Modular with child components → Better maintainability
  - [#005]: State management → Custom hook with useState → Simple and effective
  - [#006]: TypeScript config → Strict mode → Better type safety
  - [#007]: localStorage errors → Toast notifications → Better UX
  - [#008]: Testing → Vitest + React Testing Library → Fast and modern

- **Technical Assumptions Made**:
  - Node.js version 18+ available
  - pnpm as package manager (for monorepo)
  - Tailwind CSS configuration via shadcn/ui
  - crypto.randomUUID() for ID generation
  - 500 character limit for todos
  - Immediate save to localStorage (no debouncing)

### 2.3 Technical Design

#### Architecture
```
apps/
  web/                    # React application
    src/
      components/
        ui/              # shadcn/ui components
        TodoApp.tsx      # Main container component
        TodoInput.tsx    # Input component
        TodoItem.tsx     # Individual todo component
        TodoList.tsx     # List container
        TodoStats.tsx    # Statistics display
      hooks/
        useTodos.ts      # Custom hook for todo logic
        useLocalStorage.ts # Generic localStorage hook
      types/
        todo.ts          # TypeScript interfaces
      lib/
        utils.ts         # Utility functions
        storage.ts       # localStorage wrapper
      App.tsx
      main.tsx
```

#### Data Model
```typescript
interface Todo {
  id: string;           // UUID
  text: string;         // max 500 chars
  completed: boolean;   // default false
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}

interface TodoList {
  todos: Todo[];
  lastModified: string; // ISO 8601
}

// localStorage schema
{
  key: "todos-app-v1",
  value: JSON.stringify(TodoList)
}
```

#### Component Interfaces
```typescript
// Props interfaces
interface TodoInputProps {
  onAdd: (text: string) => void;
  disabled?: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

interface TodoStatsProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}
```

### 2.4 Acceptance Criteria
- **Functional Tests**:
  - User can add a todo by typing and pressing Enter
  - User can mark todo as complete/incomplete
  - User can edit todo text inline
  - User can delete individual todos
  - User can clear all completed todos with confirmation
  - Todos persist after browser refresh
  - Empty todos are prevented from being added
  - Todo text is limited to 500 characters

- **Performance**:
  - Application loads in < 2 seconds
  - UI interactions respond within 100ms
  - Handles 1000+ todos without degradation

- **Edge Cases**:
  - localStorage full: Show error toast
  - localStorage disabled: Show warning banner
  - Long todo text: Truncate with ellipsis
  - Special characters: Properly escaped

- **Success Metrics**:
  - All Vitest tests pass
  - No TypeScript errors
  - Lighthouse accessibility score > 90

## 3. Implementation Tasks

### Phase 1: Project Setup and Configuration
- [ ] **Task 1.1**: Initialize monorepo structure
  - Command: `mkdir -p apps/web && cd apps/web`
  - Create root `package.json` with workspace configuration
  - Create `pnpm-workspace.yaml`:
    ```yaml
    packages:
      - 'apps/*'
    ```

- [ ] **Task 1.2**: Create Vite React TypeScript project
  - Command: `cd apps/web && pnpm create vite@latest . --template react-ts`
  - Clean up default files (App.css, logo.svg, etc.)

- [ ] **Task 1.3**: Configure TypeScript for strict mode
  - File: `apps/web/tsconfig.json`
  - Enable all strict checks:
    ```json
    {
      "compilerOptions": {
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedIndexedAccess": true
      }
    }
    ```

- [ ] **Task 1.4**: Install and configure shadcn/ui
  - Commands:
    ```bash
    pnpm add -D tailwindcss postcss autoprefixer
    pnpm dlx tailwindcss init -p
    pnpm dlx shadcn-ui@latest init
    ```
  - Choose: Default style, Slate base color, CSS variables

- [ ] **Task 1.5**: Install required shadcn/ui components
  - Commands:
    ```bash
    pnpm dlx shadcn-ui@latest add button
    pnpm dlx shadcn-ui@latest add input
    pnpm dlx shadcn-ui@latest add checkbox
    pnpm dlx shadcn-ui@latest add card
    pnpm dlx shadcn-ui@latest add alert-dialog
    pnpm dlx shadcn-ui@latest add toast
    ```

- [ ] **Task 1.6**: Install additional dependencies
  - Command: `pnpm add lucide-react clsx tailwind-merge`
  - Command: `pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom`

### Phase 2: Core Data Layer
- [ ] **Task 2.1**: Create TypeScript interfaces
  - File: `apps/web/src/types/todo.ts`
  ```typescript
  export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface TodoList {
    todos: Todo[];
    lastModified: string;
  }

  export type TodoInput = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
  ```

- [ ] **Task 2.2**: Create localStorage utility
  - File: `apps/web/src/lib/storage.ts`
  ```typescript
  const STORAGE_KEY = 'todos-app-v1';

  export const storage = {
    get: (): TodoList | null => {
      try {
        const item = localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Failed to load todos:', error);
        return null;
      }
    },

    set: (data: TodoList): boolean => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Failed to save todos:', error);
        return false;
      }
    },

    clear: (): void => {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
  ```

- [ ] **Task 2.3**: Create useLocalStorage hook
  - File: `apps/web/src/hooks/useLocalStorage.ts`
  ```typescript
  import { useState, useEffect } from 'react';

  export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    serialize = JSON.stringify,
    deserialize = JSON.parse
  ): [T, (value: T | ((val: T) => T)) => void] {
    // Implementation with error handling
  }
  ```

### Phase 3: Todo Management Hook
- [ ] **Task 3.1**: Create useTodos custom hook
  - File: `apps/web/src/hooks/useTodos.ts`
  ```typescript
  import { useState, useEffect, useCallback } from 'react';
  import { Todo, TodoList } from '@/types/todo';
  import { storage } from '@/lib/storage';
  import { toast } from '@/components/ui/use-toast';

  export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load todos on mount
    useEffect(() => {
      const data = storage.get();
      if (data) {
        setTodos(data.todos);
      }
      setIsLoading(false);
    }, []);

    // Save todos on change
    useEffect(() => {
      if (!isLoading) {
        const success = storage.set({
          todos,
          lastModified: new Date().toISOString()
        });
        if (!success) {
          toast({
            title: "Storage Error",
            description: "Failed to save todos. Please check your browser storage.",
            variant: "destructive"
          });
        }
      }
    }, [todos, isLoading]);

    const addTodo = useCallback((text: string) => {
      if (!text.trim()) return;
      if (text.length > 500) {
        toast({
          title: "Text too long",
          description: "Todo text must be less than 500 characters",
          variant: "destructive"
        });
        return;
      }

      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTodos(prev => [...prev, newTodo]);
    }, []);

    const toggleTodo = useCallback((id: string) => {
      setTodos(prev => prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      ));
    }, []);

    const editTodo = useCallback((id: string, text: string) => {
      if (!text.trim()) return;
      if (text.length > 500) {
        toast({
          title: "Text too long",
          description: "Todo text must be less than 500 characters",
          variant: "destructive"
        });
        return;
      }

      setTodos(prev => prev.map(todo =>
        todo.id === id
          ? { ...todo, text: text.trim(), updatedAt: new Date().toISOString() }
          : todo
      ));
    }, []);

    const deleteTodo = useCallback((id: string) => {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);

    const clearCompleted = useCallback(() => {
      setTodos(prev => prev.filter(todo => !todo.completed));
    }, []);

    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;

    return {
      todos,
      isLoading,
      addTodo,
      toggleTodo,
      editTodo,
      deleteTodo,
      clearCompleted,
      activeCount,
      completedCount
    };
  }
  ```

### Phase 4: Component Implementation
- [ ] **Task 4.1**: Create TodoInput component
  - File: `apps/web/src/components/TodoInput.tsx`
  ```typescript
  import { useState, KeyboardEvent } from 'react';
  import { Plus } from 'lucide-react';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';

  interface TodoInputProps {
    onAdd: (text: string) => void;
    disabled?: boolean;
  }

  export function TodoInput({ onAdd, disabled }: TodoInputProps) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
      if (text.trim()) {
        onAdd(text);
        setText('');
      }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    return (
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          maxLength={500}
          aria-label="New todo text"
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          size="icon"
          aria-label="Add todo"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  ```

- [ ] **Task 4.2**: Create TodoItem component
  - File: `apps/web/src/components/TodoItem.tsx`
  ```typescript
  import { useState } from 'react';
  import { Check, X, Edit2, Trash2 } from 'lucide-react';
  import { Checkbox } from '@/components/ui/checkbox';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Todo } from '@/types/todo';
  import { cn } from '@/lib/utils';

  interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    onDelete: (id: string) => void;
  }

  export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
      if (editText.trim() && editText !== todo.text) {
        onEdit(todo.id, editText);
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditText(todo.text);
      setIsEditing(false);
    };

    return (
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />

        {isEditing ? (
          <>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
              maxLength={500}
              className="flex-1"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <span
              className={cn(
                "flex-1 cursor-pointer",
                todo.completed && "line-through text-muted-foreground"
              )}
              onClick={() => setIsEditing(true)}
              title={todo.text}
            >
              {todo.text}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit "${todo.text}"`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete "${todo.text}"`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    );
  }
  ```

- [ ] **Task 4.3**: Create TodoList component
  - File: `apps/web/src/components/TodoList.tsx`
  ```typescript
  import { TodoItem } from './TodoItem';
  import { Todo } from '@/types/todo';

  interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    onDelete: (id: string) => void;
  }

  export function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
    if (todos.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No todos yet. Add one above to get started!
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
  ```

- [ ] **Task 4.4**: Create TodoStats component
  - File: `apps/web/src/components/TodoStats.tsx`
  ```typescript
  import { Trash2 } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';

  interface TodoStatsProps {
    activeCount: number;
    completedCount: number;
    onClearCompleted: () => void;
  }

  export function TodoStats({ activeCount, completedCount, onClearCompleted }: TodoStatsProps) {
    return (
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{activeCount}</span> active, {' '}
          <span className="font-medium">{completedCount}</span> completed
        </div>

        {completedCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear completed
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear completed todos?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {completedCount} completed todo{completedCount !== 1 ? 's' : ''}.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearCompleted}>
                  Clear completed
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  }
  ```

- [ ] **Task 4.5**: Create main TodoApp component
  - File: `apps/web/src/components/TodoApp.tsx`
  ```typescript
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Alert, AlertDescription } from '@/components/ui/alert';
  import { AlertCircle } from 'lucide-react';
  import { TodoInput } from './TodoInput';
  import { TodoList } from './TodoList';
  import { TodoStats } from './TodoStats';
  import { useTodos } from '@/hooks/useTodos';
  import { useEffect, useState } from 'react';

  export function TodoApp() {
    const {
      todos,
      isLoading,
      addTodo,
      toggleTodo,
      editTodo,
      deleteTodo,
      clearCompleted,
      activeCount,
      completedCount
    } = useTodos();

    const [storageWarning, setStorageWarning] = useState(false);

    useEffect(() => {
      // Check if localStorage is available
      try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
      } catch {
        setStorageWarning(true);
      }
    }, []);

    return (
      <div className="container mx-auto max-w-2xl p-4">
        {storageWarning && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Local storage is disabled. Your todos will not persist after closing this page.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TodoInput onAdd={addTodo} disabled={isLoading} />
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
            />
            <TodoStats
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

### Phase 5: Application Integration
- [ ] **Task 5.1**: Update App.tsx
  - File: `apps/web/src/App.tsx`
  ```typescript
  import { TodoApp } from '@/components/TodoApp';
  import { Toaster } from '@/components/ui/toaster';

  function App() {
    return (
      <>
        <TodoApp />
        <Toaster />
      </>
    );
  }

  export default App;
  ```

- [ ] **Task 5.2**: Update main.tsx
  - File: `apps/web/src/main.tsx`
  ```typescript
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import './index.css';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  ```

- [ ] **Task 5.3**: Update index.html
  - File: `apps/web/index.html`
  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="A simple, accessible todo list application" />
      <title>Todo List</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```

### Phase 6: Testing Setup
- [ ] **Task 6.1**: Configure Vitest
  - File: `apps/web/vite.config.ts`
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  });
  ```

- [ ] **Task 6.2**: Create test setup file
  - File: `apps/web/src/test/setup.ts`
  ```typescript
  import '@testing-library/jest-dom';

  // Mock crypto.randomUUID
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => Math.random().toString(36).substr(2, 9),
    },
  });
  ```

- [ ] **Task 6.3**: Create useTodos hook tests
  - File: `apps/web/src/hooks/useTodos.test.ts`
  ```typescript
  import { renderHook, act } from '@testing-library/react';
  import { useTodos } from './useTodos';

  describe('useTodos', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('should add a todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Test todo');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Test todo');
    });

    test('should not add empty todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('');
      });

      expect(result.current.todos).toHaveLength(0);
    });

    test('should toggle todo completion', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Test todo');
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(true);
    });

    test('should edit todo text', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Original text');
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.editTodo(todoId, 'Updated text');
      });

      expect(result.current.todos[0].text).toBe('Updated text');
    });

    test('should delete todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Test todo');
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });

    test('should clear completed todos', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Todo 1');
        result.current.addTodo('Todo 2');
        result.current.addTodo('Todo 3');
      });

      act(() => {
        result.current.toggleTodo(result.current.todos[0].id);
        result.current.toggleTodo(result.current.todos[2].id);
      });

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Todo 2');
    });

    test('should calculate active and completed counts', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Todo 1');
        result.current.addTodo('Todo 2');
        result.current.addTodo('Todo 3');
      });

      act(() => {
        result.current.toggleTodo(result.current.todos[0].id);
      });

      expect(result.current.activeCount).toBe(2);
      expect(result.current.completedCount).toBe(1);
    });

    test('should persist todos to localStorage', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Persistent todo');
      });

      const stored = localStorage.getItem('todos-app-v1');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.todos).toHaveLength(1);
      expect(parsed.todos[0].text).toBe('Persistent todo');
    });

    test('should load todos from localStorage on mount', () => {
      const initialData = {
        todos: [
          {
            id: '1',
            text: 'Existing todo',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem('todos-app-v1', JSON.stringify(initialData));

      const { result } = renderHook(() => useTodos());

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Existing todo');
    });
  });
  ```

- [ ] **Task 6.4**: Create component tests
  - File: `apps/web/src/components/TodoItem.test.tsx`
  ```typescript
  import { render, screen, fireEvent } from '@testing-library/react';
  import { TodoItem } from './TodoItem';
  import { Todo } from '@/types/todo';

  const mockTodo: Todo = {
    id: '1',
    text: 'Test todo',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('TodoItem', () => {
    test('renders todo text', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    test('calls onToggle when checkbox clicked', () => {
      const onToggle = vi.fn();

      render(
        <TodoItem
          todo={mockTodo}
          onToggle={onToggle}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith('1');
    });

    test('enters edit mode when edit button clicked', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      const editButton = screen.getByLabelText('Edit "Test todo"');
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument();
    });

    test('calls onDelete when delete button clicked', () => {
      const onDelete = vi.fn();

      render(
        <TodoItem
          todo={mockTodo}
          onToggle={() => {}}
          onEdit={() => {}}
          onDelete={onDelete}
        />
      );

      const deleteButton = screen.getByLabelText('Delete "Test todo"');
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith('1');
    });

    test('shows strike-through for completed todos', () => {
      const completedTodo = { ...mockTodo, completed: true };

      render(
        <TodoItem
          todo={completedTodo}
          onToggle={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      );

      const text = screen.getByText('Test todo');
      expect(text).toHaveClass('line-through');
    });
  });
  ```

### Phase 7: Build and Deployment Configuration
- [ ] **Task 7.1**: Configure build scripts
  - File: `apps/web/package.json`
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview",
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "typecheck": "tsc --noEmit"
    }
  }
  ```

- [ ] **Task 7.2**: Create ESLint configuration
  - File: `apps/web/.eslintrc.cjs`
  ```javascript
  module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  };
  ```

- [ ] **Task 7.3**: Create .gitignore
  - File: `.gitignore`
  ```
  # Dependencies
  node_modules
  .pnp
  .pnp.js

  # Testing
  coverage
  .nyc_output

  # Production
  dist
  dist-ssr
  *.local

  # Editor directories and files
  .vscode/*
  !.vscode/extensions.json
  .idea
  .DS_Store
  *.suo
  *.ntvs*
  *.njsproj
  *.sln
  *.sw?

  # Environment variables
  .env*.local
  ```

## 4. File Changes Summary

| File                                    | Action | Purpose                          |
| --------------------------------------- | ------ | -------------------------------- |
| `pnpm-workspace.yaml`                   | Create | Monorepo configuration           |
| `apps/web/package.json`                 | Create | Project dependencies and scripts |
| `apps/web/tsconfig.json`                | Create | TypeScript configuration         |
| `apps/web/vite.config.ts`               | Create | Vite and test configuration      |
| `apps/web/tailwind.config.js`           | Create | Tailwind CSS configuration       |
| `apps/web/postcss.config.js`            | Create | PostCSS configuration            |
| `apps/web/index.html`                   | Create | HTML entry point                 |
| `apps/web/src/main.tsx`                 | Create | React entry point                |
| `apps/web/src/App.tsx`                  | Create | Main app component               |
| `apps/web/src/index.css`                | Create | Global styles                    |
| `apps/web/src/types/todo.ts`            | Create | TypeScript interfaces            |
| `apps/web/src/lib/storage.ts`           | Create | localStorage utility             |
| `apps/web/src/lib/utils.ts`             | Create | Utility functions                |
| `apps/web/src/hooks/useTodos.ts`        | Create | Todo management hook             |
| `apps/web/src/hooks/useLocalStorage.ts` | Create | Generic localStorage hook        |
| `apps/web/src/components/TodoApp.tsx`   | Create | Main container component         |
| `apps/web/src/components/TodoInput.tsx` | Create | Input component                  |
| `apps/web/src/components/TodoItem.tsx`  | Create | Individual todo component        |
| `apps/web/src/components/TodoList.tsx`  | Create | List container                   |
| `apps/web/src/components/TodoStats.tsx` | Create | Statistics display               |
| `apps/web/src/components/ui/*`          | Create | shadcn/ui components             |
| `apps/web/src/test/setup.ts`            | Create | Test configuration               |
| `apps/web/src/**/*.test.ts(x)`          | Create | Test files                       |

## 5. Validation Checklist

- [ ] All functional requirements from spec are addressed
- [ ] TypeScript strict mode configured
- [ ] All components have proper TypeScript interfaces
- [ ] localStorage error handling implemented
- [ ] Toast notifications for user feedback
- [ ] Accessibility attributes (ARIA labels) included
- [ ] Responsive design with Tailwind CSS
- [ ] Character limit (500) enforced
- [ ] Empty todo prevention implemented
- [ ] Confirmation dialog for bulk delete
- [ ] Test coverage for critical functionality
- [ ] Monorepo structure for future server addition
- [ ] All shadcn/ui components properly integrated
- [ ] Lucide React icons used consistently

## 6. Post-Implementation Tasks

1. Run `pnpm install` to install all dependencies
2. Run `pnpm dev` to start development server
3. Run `pnpm test` to ensure all tests pass
4. Run `pnpm typecheck` to verify TypeScript compilation
5. Run `pnpm build` to create production build
6. Test localStorage persistence across browser sessions
7. Test with screen readers for accessibility
8. Verify responsive design on mobile devices
9. Check browser console for any errors or warnings
10. Performance test with 1000+ todos