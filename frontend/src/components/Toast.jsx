import { useEffect, useState } from 'react';

const toastVariants = {
  success: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  running: {
    bg: 'bg-indigo-500',
    text: 'text-white',
    icon: (
      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  completed: {
    bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    text: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-500',
    text: 'text-white',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

export default function Toast({ id, message, variant = 'success', duration = 4000, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onDismiss(id);
        }, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for exit animation before actually removing
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  const variantStyles = toastVariants[variant] || toastVariants.success;
  const isCompleted = variant === 'completed';

  return (
    <div
      className={`
        relative flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl
        ${variantStyles.bg} ${variantStyles.text}
        transform transition-all duration-300 ease-out
        ${isExiting ? 'animate-slide-out-right opacity-0' : 'animate-slide-in-right opacity-100'}
        ${isCompleted && !isExiting ? 'animate-pulse-subtle' : ''}
        backdrop-blur-sm
      `}
      style={{
        minWidth: '320px',
        maxWidth: '420px',
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {variantStyles.icon}
      </div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="
          flex-shrink-0 ml-2
          opacity-70 hover:opacity-100
          transition-opacity duration-200
          focus:outline-none
        "
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
