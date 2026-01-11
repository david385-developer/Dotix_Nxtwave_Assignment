import { useState, useEffect } from 'react';
import { createJob } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function JobForm({ onSuccess }) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    let parsedPayload;
    if (payload) {
      try {
        parsedPayload = JSON.parse(payload);
      } catch {
        setError('Payload must be valid JSON');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await createJob({ taskName, priority, payload: parsedPayload });
      setTaskName('');
      setPayload('');
      setIsOpen(false);
      showToast('Job created successfully', 'success');
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create job');
      showToast(err.message || 'Failed to create job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(true), 10);
      
      // Handle ESC key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsAnimating(false);
          setTimeout(() => {
            setIsOpen(false);
            setError('');
            setTaskName('');
            setPayload('');
          }, 200);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setError('');
      setTaskName('');
      setPayload('');
    }, 200);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          mb-6 inline-flex items-center px-5 py-3
          bg-indigo-600 text-white text-sm font-semibold rounded-lg
          hover:bg-indigo-700 active:bg-indigo-800 active:scale-95
          shadow-sm hover:shadow-lg
          transition-all duration-200 ease-out
          transform hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        "
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Job
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={handleClose}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-50 backdrop-blur-sm"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className={`
                inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl
                transform transition-all duration-300 ease-out
                sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
                ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={submit}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Create New Job</h2>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="
                        p-1.5 rounded-lg
                        text-slate-400 hover:text-slate-600 hover:bg-slate-100
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-slate-300
                      "
                      aria-label="Close modal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Task Name
                      </label>
                      <input
                        className="
                          w-full px-3 py-2 text-sm
                          border border-slate-300 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          transition-all duration-200
                          hover:border-slate-400
                        "
                        placeholder="Enter task name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Priority
                      </label>
                      <select
                        className="
                          w-full px-3 py-2 text-sm
                          border border-slate-300 rounded-lg
                          bg-white text-slate-700
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          transition-all duration-200
                          hover:border-slate-400
                        "
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Payload <span className="text-slate-400 font-normal">(JSON, optional)</span>
                      </label>
                      <textarea
                        className="
                          w-full px-3 py-2 text-sm font-mono
                          border border-slate-300 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          transition-all duration-200
                          hover:border-slate-400
                          resize-none
                        "
                        placeholder='{"key": "value"}'
                        rows={4}
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="
                        p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg
                        flex items-start gap-2
                      ">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="
                      px-4 py-2 text-sm font-medium text-slate-700
                      bg-white border border-slate-300 rounded-lg
                      hover:bg-slate-50
                      transition-colors duration-200
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      px-4 py-2 text-sm font-semibold text-white
                      bg-indigo-600 rounded-lg
                      hover:bg-indigo-700 active:bg-indigo-800 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600
                      transition-all duration-200 ease-out
                      shadow-sm hover:shadow-md
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    "
                  >
                    {isSubmitting ? 'Creating...' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
