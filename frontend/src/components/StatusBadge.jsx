export default function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-gray-200 text-gray-800',
    running: 'bg-yellow-200 text-yellow-800',
    completed: 'bg-green-200 text-green-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}
