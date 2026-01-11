export default function JobFilters({ filters, setFilters }) {
  const hasActiveFilters = filters.status || filters.priority;

  return (
    <div className="flex items-center gap-3 mb-8">
      <select
        className="
          px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-lg
          bg-white text-slate-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-all duration-200 ease-out
          hover:border-slate-400 hover:shadow-sm
          cursor-pointer
        "
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="running">Running</option>
        <option value="completed">Completed</option>
      </select>

      <select
        className="
          px-4 py-2.5 text-sm font-medium border border-slate-300 rounded-lg
          bg-white text-slate-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-all duration-200 ease-out
          hover:border-slate-400 hover:shadow-sm
          cursor-pointer
        "
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={() => setFilters({ status: '', priority: '' })}
          className="
            px-4 py-2.5 text-sm font-semibold text-slate-600
            hover:text-slate-900 hover:bg-slate-50
            rounded-lg
            transition-all duration-200 ease-out
            flex items-center gap-2
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
}
