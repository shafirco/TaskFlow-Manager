import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete, loading }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'Pending';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        // Show pending tasks first
        if (a.status === 'Pending' && b.status === 'Completed') return -1;
        if (a.status === 'Completed' && b.status === 'Pending') return 1;
        return 0;
      default:
        return 0;
    }
  });

  const getTaskCounts = () => {
    const total = tasks.length;
    const pending = tasks.filter(task => task.status === 'Pending').length;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    return { total, pending, completed };
  };

  const { total, pending, completed } = getTaskCounts();

  if (loading && tasks.length === 0) {
    return (
      <div className="card">
        <div className="loading-container">
          <span className="loading-spinner"></span>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Your Tasks
            {total > 0 && (
              <span className="task-count">
                ({total} total, {pending} pending, {completed} completed)
              </span>
            )}
          </h2>
        </div>

        {total > 0 && (
          <div className="task-controls">
            <div className="filter-controls">
              <label htmlFor="filter" className="form-label">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Tasks ({total})</option>
                <option value="pending">Pending ({pending})</option>
                <option value="completed">Completed ({completed})</option>
              </select>
            </div>

            <div className="sort-controls">
              <label htmlFor="sort" className="form-label">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="tasks-grid">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              loading={loading}
            />
          ))
        ) : total === 0 ? (
          <div className="card empty-state">
            <div className="empty-content">
              <h3>No tasks yet</h3>
              <p>Create your first task to get started!</p>
            </div>
          </div>
        ) : (
          <div className="card empty-state">
            <div className="empty-content">
              <h3>No tasks match your filter</h3>
              <p>Try changing your filter settings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
