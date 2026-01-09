const db = require('../database');
const { sendWebhook } = require('./webhookService');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const VALID_STATUS = ['pending', 'running', 'completed'];
const VALID_PRIORITY = ['Low', 'Medium', 'High'];

exports.createJob = async ({ taskName, payload, priority }) => {
  if (!taskName || !priority) {
    throw new Error('taskName and priority are required');
  }

  return db.Job.create({
    taskName,
    payload,
    priority,
    status: 'pending'
  });
};

exports.getAllJobs = async ({ status, priority }) => {
  const where = {};
  // ----- STATUS FILTER -----
  if (status) {
    const normalizedStatus = status.toLowerCase();

    if (!VALID_STATUS.includes(normalizedStatus)) {
      throw new Error(
        `Invalid status. Allowed values: ${VALID_STATUS.join(', ')}`
      );
    }

    where.status = normalizedStatus;
  }

  // ----- PRIORITY FILTER -----
  if (priority) {
    const normalizedPriority =
      priority.charAt(0).toUpperCase() +
      priority.slice(1).toLowerCase();

    if (!VALID_PRIORITY.includes(normalizedPriority)) {
      throw new Error(
        `Invalid priority. Allowed values: ${VALID_PRIORITY.join(', ')}`
      );
    }

    where.priority = normalizedPriority;
  }

  return db.Job.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });
};

exports.getJobById = async (id) => {
  const job = await db.Job.findByPk(id);
  if (!job) throw new Error('Job not found');
  return job;
};

exports.runJob = async (id) => {
  const job = await db.Job.findByPk(id);
  if (!job) throw new Error('Job not found');
  if (job.status !== 'pending') throw new Error('Job already processed');

  job.status = 'running';
  await job.save();

  // Simulate execution
  await delay(3000);

  job.status = 'completed';
  job.completedAt = new Date();
  await job.save();

  // Trigger webhook (fire and forget)
  sendWebhook(process.env.WEBHOOK_URL, {
    jobId: job.id,
    taskName: job.taskName,
    priority: job.priority,
    payload: job.payload,
    completedAt: job.completedAt
  });

  return job;
};
