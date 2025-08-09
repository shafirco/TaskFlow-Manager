import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ErrorMessage from './components/ErrorMessage';
import taskAPI from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Check API connection on app load
  useEffect(() => {
    checkConnection();
  }, []);

  // Load tasks on app load
  useEffect(() => {
    loadTasks();
  }, []);

  const checkConnection = async () => {
    try {
      await taskAPI.healthCheck();
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('API connection failed:', error);
    }
  };

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getTasks();
      setTasks(response.data || []);
      setConnectionStatus('connected');
    } catch (error) {
      setError(error);
      setConnectionStatus('disconnected');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTaskCreate = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.createTask(taskData);
      
      // Add new task to the beginning of the list
      setTasks(prev => [response.data, ...prev]);
      
      // Show success message briefly
      setTimeout(() => {
        // Could add a success toast here
      }, 100);
    } catch (error) {
      setError(error);
      throw error; // Re-throw to handle in form component
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.updateTask(taskId, updateData);
      
      // Update task in the list
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? response.data : task
        )
      );
    } catch (error) {
      setError(error);
      throw error; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await taskAPI.deleteTask(taskId);
      
      // Remove task from the list
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      setError(error);
      throw error; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    loadTasks();
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">
            TaskFlow
            <span className="app-subtitle">מנהל משימות פשוט ויעיל</span>
          </h1>
          <div className="connection-status">
            <span className={`status-indicator status-${connectionStatus}`}>
              <span className="status-dot"></span>
              {connectionStatus === 'connected' && 'Connected'}
              {connectionStatus === 'disconnected' && 'Disconnected'}
              {connectionStatus === 'checking' && 'Checking...'}
            </span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <ErrorMessage 
            error={error} 
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />

          <TaskForm 
            onTaskCreate={handleTaskCreate}
            loading={loading}
          />

          <TaskList 
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            loading={loading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 TaskFlow - מנהל משימות פשוט ויעיל</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
