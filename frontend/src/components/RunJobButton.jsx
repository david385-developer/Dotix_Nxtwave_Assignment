export default function RunJobButton({ status, onRun }) {
  if (status === 'completed') {
    return <span className="text-green-600 font-semibold">Completed</span>;
  }

  return (
    <button
      onClick={onRun}
      disabled={status !== 'pending'}
      className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
    >
      Run
    </button>
  );
}
