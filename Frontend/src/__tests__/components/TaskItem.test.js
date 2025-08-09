import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '../../components/TaskItem';

const mockTask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'Pending',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:00:00.000Z'
};

describe('TaskItem Component', () => {
  const mockOnTaskUpdate = jest.fn();
  const mockOnTaskDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information', () => {
    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  test('renders task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: '' };
    
    render(
      <TaskItem
        task={taskWithoutDescription}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  test('shows updated timestamp when different from created', () => {
    const updatedTask = {
      ...mockTask,
      updatedAt: '2024-01-02T12:00:00.000Z'
    };

    render(
      <TaskItem
        task={updatedTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  test('toggles task status when button clicked', async () => {
    mockOnTaskUpdate.mockResolvedValue();

    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const toggleButton = screen.getByText('Mark Complete');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockOnTaskUpdate).toHaveBeenCalledWith('1', { status: 'Completed' });
    });
  });

  test('toggles completed task back to pending', async () => {
    const completedTask = { ...mockTask, status: 'Completed' };
    mockOnTaskUpdate.mockResolvedValue();

    render(
      <TaskItem
        task={completedTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const toggleButton = screen.getByText('Mark Pending');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockOnTaskUpdate).toHaveBeenCalledWith('1', { status: 'Pending' });
    });
  });

  test('enters edit mode when edit button clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('saves edited task', async () => {
    mockOnTaskUpdate.mockResolvedValue();

    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Edit the task
    const titleInput = screen.getByDisplayValue('Test Task');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    // Save changes
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnTaskUpdate).toHaveBeenCalledWith('1', {
        title: 'Updated Task',
        description: 'Updated Description'
      });
    });
  });

  test('cancels edit mode', () => {
    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Edit the task
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Changed Title' } });

    // Cancel changes
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Should be back to view mode with original values
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Changed Title')).not.toBeInTheDocument();
  });

  test('validates edit form', async () => {
    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Clear title
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: '' } });

    // Try to save
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockOnTaskUpdate).not.toHaveBeenCalled();
  });

  test('handles edit validation errors from server', async () => {
    const serverError = {
      data: {
        errors: [
          { field: 'title', message: 'Server validation error' }
        ]
      }
    };

    mockOnTaskUpdate.mockRejectedValue(serverError);

    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    // Enter edit mode and save
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Server validation error')).toBeInTheDocument();
    });
  });

  test('deletes task after confirmation', async () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    mockOnTaskDelete.mockResolvedValue();

    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');

    await waitFor(() => {
      expect(mockOnTaskDelete).toHaveBeenCalledWith('1');
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  test('cancels delete when not confirmed', () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);

    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnTaskDelete).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  test('disables buttons when loading', () => {
    render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={true}
      />
    );

    expect(screen.getByText('Mark Complete')).toBeDisabled();
    expect(screen.getByText('Edit')).toBeDisabled();
    expect(screen.getByText('Delete')).toBeDisabled();
  });

  test('displays correct status badge class', () => {
    const { rerender } = render(
      <TaskItem
        task={mockTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const pendingBadge = screen.getByText('Pending');
    expect(pendingBadge).toHaveClass('status-pending');

    const completedTask = { ...mockTask, status: 'Completed' };
    rerender(
      <TaskItem
        task={completedTask}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        loading={false}
      />
    );

    const completedBadge = screen.getByText('Completed');
    expect(completedBadge).toHaveClass('status-completed');
  });
});
