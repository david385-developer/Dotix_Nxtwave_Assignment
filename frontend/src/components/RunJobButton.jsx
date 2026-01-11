export default function RunJobButton({ status, onRun }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </span>
    );
  }

  const isDisabled = status !== 'pending';

  return (
    <button
      onClick={onRun}
      disabled={isDisabled}
      className={`
        inline-flex items-center px-3.5 py-2 text-sm font-semibold rounded-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDisabled 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:ring-indigo-500'
        }
      `}
    >
      {status === 'running' ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Running
        </>
      ) : (
        'Run'
      )}
    </button>
  );
}
