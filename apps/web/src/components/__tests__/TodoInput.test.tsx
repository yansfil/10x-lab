import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoInput } from '../TodoInput'

describe('TodoInput', () => {
  it('renders input and button', () => {
    const mockAdd = vi.fn()
    render(<TodoInput onAdd={mockAdd} />)

    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onAdd when form is submitted with text', async () => {
    const mockAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={mockAdd} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const button = screen.getByRole('button')

    await user.type(input, 'New task')
    await user.click(button)

    expect(mockAdd).toHaveBeenCalledWith('New task', 'medium')
  })

  it('does not call onAdd with empty text', async () => {
    const mockAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={mockAdd} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('clears input after adding todo', async () => {
    const mockAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={mockAdd} />)

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement

    await user.type(input, 'New task')
    await user.keyboard('{Enter}')

    expect(input.value).toBe('')
  })

  it('allows selecting priority', async () => {
    const mockAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoInput onAdd={mockAdd} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const select = screen.getByRole('combobox') as HTMLSelectElement

    await user.selectOptions(select, 'high')
    await user.type(input, 'Urgent task')
    await user.keyboard('{Enter}')

    expect(mockAdd).toHaveBeenCalledWith('Urgent task', 'high')
  })
})