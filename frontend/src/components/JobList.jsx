import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import RunJobButton from './RunJobButton';

export default function JobList({ jobs, onRun }) {
  const navigate = useNavigate();

  const handleRowClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <table className="w-full bg-white rounded shadow">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Task</th>
          <th className="p-2">Priority</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr
            key={job.id}
            className="border-t hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => handleRowClick(job.id)}
          >
            <td className="p-2 font-medium text-blue-600">{job.taskName}</td>
            <td className="p-2">{job.priority}</td>
            <td className="p-2"><StatusBadge status={job.status} /></td>
            <td className="p-2" onClick={(e) => e.stopPropagation()}>
              <RunJobButton status={job.status} onRun={() => onRun(job.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
