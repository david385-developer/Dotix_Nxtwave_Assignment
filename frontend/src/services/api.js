const BASE_URL = 'http://localhost:3000';

export async function fetchJobs(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${BASE_URL}/jobs?${params}`);
  return res.json();
}

export async function createJob(job) {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return res.json();
}

export async function runJob(id) {
  const res = await fetch(`${BASE_URL}/run-job/${id}`, { method: 'POST' });
  return res.json();
}

export async function fetchJobById(id) {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  return res.json();
}
