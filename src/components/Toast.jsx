import { useState, useCallback, useEffect } from 'react';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return { toasts, toast: addToast };
}

export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--success)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ display: 'inline', marginRight: 8 }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          {t.type === 'error' && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--danger)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ display: 'inline', marginRight: 8 }}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
