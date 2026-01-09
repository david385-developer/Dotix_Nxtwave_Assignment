const jobService = require('../services/jobService');

exports.createJob = async (req, res) => {
  try {
    console.log('Creating job with data:', req.body);
    const job = await jobService.createJob(req.body);
    console.log('Job created:', job.id);
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { status, priority } = req.query;
    console.log(status)
    const jobs = await jobService.getAllJobs({
      status,
      priority
    });

    res.status(200).json(jobs);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

exports.getJobById = async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
};

exports.runJob = async (req, res) => {
  try {
    const job = await jobService.runJob(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.testWebhook = async (req, res) => {
  await webhookService.sendWebhook(process.env.WEBHOOK_URL, req.body);
  res.json({ message: 'Webhook sent' });
};
