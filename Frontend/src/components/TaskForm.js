import React, { useState } from 'react';

const TaskForm = ({ onTaskCreate, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onTaskCreate({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      // Reset form on success
      setFormData({
        title: '',
        description: ''
      });
      setErrors({});
    } catch (error) {
      // Handle validation errors from server
      if (error.data && error.data.errors) {
        const serverErrors = {};
        error.data.errors.forEach(err => {
          serverErrors[err.field || err.param] = err.message;
        });
        setErrors(serverErrors);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Add New Task</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title..."
            disabled={loading}
            maxLength={100}
          />
          {errors.title && (
            <div className="error-message">{errors.title}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter task description (optional)..."
            disabled={loading}
            maxLength={500}
            rows={3}
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
          <div className="char-count">
            {formData.description.length}/500 characters
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !formData.title.trim()}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating...
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
