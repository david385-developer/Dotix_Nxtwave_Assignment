import { useEffect, useState, useCallback } from 'react';
import { fetchJobs, runJob } from '../services/api';
import JobForm from '../components/JobForm';
import JobFilters from '../components/JobFilters';
import JobList from '../components/JobList';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  // Fetch jobs from backend
  const loadJobs = useCallback(async () => {
    const data = await fetchJobs(filters);
    setJobs(data);
  }, [filters]);

  // 🔑 THIS is what loads ALL jobs on page load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Job Scheduler Dashboard</h1>

      <JobForm onSuccess={loadJobs} />
      <JobFilters filters={filters} setFilters={setFilters} />
      <JobList
        jobs={jobs}
        onRun={async (id) => {
          await runJob(id);
          loadJobs();
        }}
      />
    </div>
  );
}
