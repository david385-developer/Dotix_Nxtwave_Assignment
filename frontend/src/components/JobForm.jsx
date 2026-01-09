import { useState } from 'react';
import { createJob } from '../services/api';

export default function JobForm({ onSuccess }) {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    let parsedPayload;
    if (payload) {
      try {
        parsedPayload = JSON.parse(payload);
      } catch {
        setError('Payload must be valid JSON');
        return;
      }
    }

    await createJob({ taskName, priority, payload: parsedPayload });
    setTaskName('');
    setPayload('');
    onSuccess();
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="font-semibold mb-2">Create Job</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full mb-2"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Payload (JSON optional)"
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
}
