import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../../components/TaskForm';

describe('TaskForm Component', () => {
  const mockOnTaskCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements', () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    mockOnTaskCreate.mockResolvedValue();

    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnTaskCreate).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description'
      });
    });
  });

  test('submits form with title only', async () => {
    mockOnTaskCreate.mockResolvedValue();

    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnTaskCreate).toHaveBeenCalledWith({
        title: 'Test Task',
        description: ''
      });
    });
  });

  test('prevents submission with empty title', () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const submitButton = screen.getByText('Add Task');
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    expect(mockOnTaskCreate).not.toHaveBeenCalled();
  });

  test('shows validation error for empty title', async () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const submitButton = screen.getByText('Add Task');

    // Enter and then clear the title
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('shows validation error for title too long', async () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'a'.repeat(101) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title cannot exceed 100 characters')).toBeInTheDocument();
    });
  });

  test('shows validation error for description too long', async () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(501) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description cannot exceed 500 characters')).toBeInTheDocument();
    });
  });

  test('shows character count for description', () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const descriptionInput = screen.getByLabelText(/Description/);
    
    expect(screen.getByText('0/500 characters')).toBeInTheDocument();

    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    expect(screen.getByText('16/500 characters')).toBeInTheDocument();
  });

  test('clears error when user starts typing', async () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const submitButton = screen.getByText('Add Task');

    // Trigger validation error
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    // Start typing again
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });

  test('resets form after successful submission', async () => {
    mockOnTaskCreate.mockResolvedValue();

    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  test('handles server validation errors', async () => {
    const serverError = {
      data: {
        errors: [
          { field: 'title', message: 'Server validation error for title' },
          { field: 'description', message: 'Server validation error for description' }
        ]
      }
    };

    mockOnTaskCreate.mockRejectedValue(serverError);

    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server validation error for title')).toBeInTheDocument();
      expect(screen.getByText('Server validation error for description')).toBeInTheDocument();
    });
  });

  test('disables form when loading', () => {
    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={true} />);

    const titleInput = screen.getByLabelText(/Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const submitButton = screen.getByText('Creating...');

    expect(titleInput).toBeDisabled();
    expect(descriptionInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test('trims whitespace from inputs', async () => {
    mockOnTaskCreate.mockResolvedValue();

    render(<TaskForm onTaskCreate={mockOnTaskCreate} loading={false} />);

    const titleInput = screen.getByLabelText(/Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: '  Test Task  ' } });
    fireEvent.change(descriptionInput, { target: { value: '  Test Description  ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnTaskCreate).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description'
      });
    });
  });
});
