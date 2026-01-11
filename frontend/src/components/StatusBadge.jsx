export default function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-slate-100 text-slate-700 border border-slate-200',
    running: 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse-subtle',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-200/50',
  };

  const capitalizeStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
      transition-all duration-300
      ${styles[status]}
      ${status === 'running' ? 'relative overflow-hidden' : ''}
    `}>
      {status === 'running' && (
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent animate-shimmer"></span>
      )}
      <span className={`
        w-1.5 h-1.5 rounded-full mr-1.5 bg-current
        ${status === 'running' ? 'opacity-100 animate-pulse' : 'opacity-60'}
        ${status === 'completed' ? 'opacity-100' : ''}
      `}></span>
      {status === 'completed' && (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {capitalizeStatus}
    </span>
  );
}
