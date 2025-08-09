import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import taskAPI from '../services/api';

// Mock the API
jest.mock('../services/api');

const mockTasks = [
  {
    _id: '1',
    title: 'Test Task 1',
    description: 'Test Description 1',
    status: 'Pending',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    title: 'Test Task 2',
    description: 'Test Description 2',
    status: 'Completed',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }
];

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app title and main elements', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockResolvedValue({ success: true, data: mockTasks });

    render(<App />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Simple Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    });
  });

  test('displays connection status', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockResolvedValue({ success: true, data: [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  test('handles connection error', async () => {
    taskAPI.healthCheck.mockRejectedValue(new Error('Connection failed'));
    taskAPI.getTasks.mockRejectedValue(new Error('Connection failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });
  });

  test('loads and displays tasks', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockResolvedValue({ success: true, data: mockTasks });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('displays empty state when no tasks', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockResolvedValue({ success: true, data: [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(screen.getByText('Create your first task to get started!')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockRejectedValue({
      message: 'Failed to load tasks',
      type: 'api'
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/Failed to load tasks/)).toBeInTheDocument();
    });
  });

  test('creates new task successfully', async () => {
    const newTask = {
      _id: '3',
      title: 'New Task',
      description: 'New Description',
      status: 'Pending',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z'
    };

    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockResolvedValue({ success: true, data: [] });
    taskAPI.createTask.mockResolvedValue({ success: true, data: newTask });

    render(<App />);

    const titleInput = screen.getByPlaceholderText('Enter task title...');
    const descriptionInput = screen.getByPlaceholderText('Enter task description (optional)...');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description'
      });
    });
  });

  test('handles task creation error', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockResolvedValue({ success: true, data: [] });
    taskAPI.createTask.mockRejectedValue({
      message: 'Validation failed',
      data: { errors: [{ field: 'title', message: 'Title is required' }] }
    });

    render(<App />);

    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test('retries loading tasks when retry button is clicked', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks
      .mockRejectedValueOnce({ message: 'Network error' })
      .mockResolvedValueOnce({ success: true, data: mockTasks });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    expect(taskAPI.getTasks).toHaveBeenCalledTimes(2);
  });

  test('dismisses error when dismiss button is clicked', async () => {
    taskAPI.healthCheck.mockResolvedValue({ success: true });
    taskAPI.getTasks.mockRejectedValue({ message: 'Network error' });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);

    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});
