import React from 'react';

const ErrorMessage = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="alert alert-error">
      <div className="error-content">
        <strong>Error:</strong> {error.message || 'An unexpected error occurred'}
        {error.type === 'network' && (
          <p>
            <small>
              Please check your internet connection and make sure the server is running.
            </small>
          </p>
        )}
      </div>
      <div className="error-actions">
        {onRetry && (
          <button onClick={onRetry} className="btn btn-sm btn-primary">
            Try Again
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="btn btn-sm btn-secondary">
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
