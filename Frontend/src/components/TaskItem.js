import React, { useState } from 'react';

const TaskItem = ({ task, onTaskUpdate, onTaskDelete, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || ''
  });
  const [errors, setErrors] = useState({});

  const handleStatusToggle = async () => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await onTaskUpdate(task._id, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!editData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (editData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    
    if (editData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onTaskUpdate(task._id, {
        title: editData.title.trim(),
        description: editData.description.trim()
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      if (error.data && error.data.errors) {
        const serverErrors = {};
        error.data.errors.forEach(err => {
          serverErrors[err.field || err.param] = err.message;
        });
        setErrors(serverErrors);
      }
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || ''
    });
    setErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onTaskDelete(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card task-item">
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label htmlFor={`edit-title-${task._id}`} className="form-label">
              Title *
            </label>
            <input
              type="text"
              id={`edit-title-${task._id}`}
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={loading}
              maxLength={100}
            />
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor={`edit-description-${task._id}`} className="form-label">
              Description
            </label>
            <textarea
              id={`edit-description-${task._id}`}
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
              disabled={loading}
              maxLength={500}
              rows={3}
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          <div className="task-actions">
            <button
              type="submit"
              className="btn btn-success btn-sm"
              disabled={loading || !editData.title.trim()}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleEditCancel}
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <div className="task-info">
              <h3 className="task-title">{task.title}</h3>
              <span className={`status-badge status-${task.status.toLowerCase()}`}>
                {task.status}
              </span>
            </div>
            <div className="task-meta">
              <small className="text-muted">
                Created: {formatDate(task.createdAt)}
              </small>
              {task.updatedAt !== task.createdAt && (
                <small className="text-muted">
                  Updated: {formatDate(task.updatedAt)}
                </small>
              )}
            </div>
          </div>

          {task.description && (
            <div className="task-description">
              <p>{task.description}</p>
            </div>
          )}

          <div className="task-actions">
            <button
              onClick={handleStatusToggle}
              className={`btn btn-sm ${
                task.status === 'Pending' ? 'btn-success' : 'btn-secondary'
              }`}
              disabled={loading}
            >
              {task.status === 'Pending' ? 'Mark Complete' : 'Mark Pending'}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger btn-sm"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
