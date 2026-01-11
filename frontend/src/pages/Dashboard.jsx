import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchJobs, runJob } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import JobForm from '../components/JobForm';
import JobFilters from '../components/JobFilters';
import JobList from '../components/JobList';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const previousJobsRef = useRef([]);

  // Fetch jobs from backend
  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchJobs(filters);
      const previousJobs = previousJobsRef.current;
      
      // Check for status changes and show toasts
      if (previousJobs.length > 0) {
        data.forEach((currentJob) => {
          const previousJob = previousJobs.find(j => j.id === currentJob.id);
          if (previousJob) {
            // Job changed from running to completed
            if (previousJob.status === 'running' && currentJob.status === 'completed') {
              showToast('Job completed successfully', 'completed', 5000);
            }
          }
        });
      }
      
      previousJobsRef.current = data;
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      showToast('Failed to load jobs', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  // 🔑 THIS is what loads ALL jobs on page load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Calculate statistics
  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Job Scheduler</h1>
            <p className="mt-2 text-base text-slate-600 font-medium">
              Manage and monitor your scheduled tasks
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-slate-100 rounded-xl p-3 group-hover:bg-slate-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{stats.total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-slate-100 rounded-xl p-3 group-hover:bg-slate-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{stats.pending.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-xl p-3 group-hover:bg-amber-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500 mb-1">Running</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{stats.running.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-100 rounded-xl p-3 group-hover:bg-emerald-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500 mb-1">Completed</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{stats.completed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions and Filters */}
        <div className="mb-6">
          <JobForm onSuccess={loadJobs} />
        </div>

        <JobFilters filters={filters} setFilters={setFilters} />

        {/* Job List */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-5 text-slate-600 font-medium">Loading jobs...</p>
          </div>
        ) : (
          <JobList
            jobs={jobs}
            onRun={async (id) => {
              try {
                await runJob(id);
                showToast('Job is running…', 'running', 3000);
                // Poll for status updates
                setTimeout(() => {
                  loadJobs();
                }, 2000);
                setTimeout(() => {
                  loadJobs();
                }, 5000);
              } catch (error) {
                showToast('Failed to run job', 'error');
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
