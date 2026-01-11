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

  // Safely parse payload if it's a string
  let payloadDisplay = null;
  if (job?.payload) {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-500 font-medium">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/jobs')}
          className="
            mb-6 inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700
            bg-white border border-slate-300 rounded-lg
            hover:bg-slate-50 hover:shadow-sm
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
          "
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-6 border-b border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{job.taskName}</h1>
                <p className="text-sm text-slate-500 font-medium">Job ID: {job.id}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Priority
                </label>
                <span className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                  border ${getPriorityColor(job.priority)}
                `}>
                  {job.priority}
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Status
                </label>
                <div>
                  <StatusBadge status={job.status} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Created At
                </label>
                <p className="text-sm text-slate-900">{formatDate(job.createdAt)}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Completed At
                </label>
                <p className="text-sm text-slate-900">
                  {job.completedAt ? formatDate(job.completedAt) : (
                    <span className="text-slate-400">Not completed</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {payloadDisplay && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Payload</h2>
            </div>
            <div className="px-6 py-4">
              <pre className="
                bg-slate-50 p-4 rounded-lg text-sm font-mono
                overflow-auto max-h-96
                border border-slate-200
                text-slate-700
              ">
                {JSON.stringify(payloadDisplay, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
