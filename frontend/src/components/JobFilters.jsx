export default function JobFilters({ filters, setFilters }) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="border p-2 rounded"
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="running">Running</option>
        <option value="completed">Completed</option>
      </select>

      <select
        className="border p-2 rounded"
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        onClick={() => setFilters({ status: '', priority: '' })}
        className="text-blue-600 underline"
      >
        Reset
      </button>
    </div>
  );
}
