import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import RunJobButton from './RunJobButton';

export default function JobList({ jobs, onRun }) {
  const navigate = useNavigate();

  const handleRowClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
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

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
        <svg className="w-14 h-14 mx-auto text-slate-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-slate-600 font-semibold text-base mb-1">No jobs found</p>
        <p className="text-slate-400 text-sm">Create your first job to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="
                  hover:bg-slate-50 cursor-pointer
                  transition-all duration-200 ease-out
                  group
                  transform hover:-translate-y-0.5
                "
                onClick={() => handleRowClick(job.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-0 group-hover:scale-100"></div>
                    <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 truncate max-w-xs" title={job.taskName}>
                      {job.taskName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    border ${getPriorityColor(job.priority)}
                  `}>
                    {job.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={job.status} />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RunJobButton status={job.status} onRun={() => onRun(job.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
