import { useEffect, useState } from 'react';
import { fetchJobById } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 bg-red-100 text-red-700 rounded">{error}</div>;
  if (!job) return <div className="p-6 text-center text-gray-500">Job not found</div>;

  // Safely parse payload if it's a string
  let payloadDisplay = null;
  if (job.payload) {
    try {
      payloadDisplay = typeof job.payload === 'string' ? JSON.parse(job.payload) : job.payload;
    } catch {
      payloadDisplay = job.payload;
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/jobs')}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.taskName}</h1>
              <p className="text-gray-500">Job ID: {job.id}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>

     
          <div className="grid grid-cols-2 gap-4 mb-6 border-t pt-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">Priority</label>
              <p className="text-lg font-medium">{job.priority}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <p className="text-lg font-medium">{job.status}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Created At</label>
              <p className="text-sm">{formatDate(job.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Completed At</label>
              <p className="text-sm">{job.completedAt ? formatDate(job.completedAt) : 'Not completed'}</p>
            </div>
          </div>
        </div>

        {payloadDisplay && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payload</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 border border-gray-300">
              {JSON.stringify(payloadDisplay, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
