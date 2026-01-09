# 🚀 Job Scheduler & Automation Dashboard

A simplified internal automation system inspired by Dotix.  
This project demonstrates **full-stack engineering skills** across backend APIs, database design, frontend UI, and webhook integrations.

The system allows users to:
- Create jobs
- View all jobs stored in the database
- Filter jobs by status and priority
- Run jobs (simulated execution)
- View detailed job information
- Trigger outbound webhooks when jobs complete

---

## 📦 1. Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MySQL (running locally)
- A webhook testing URL (e.g. https://webhook.site)

---

### Backend Setup

```bash
cd backend
npm install

+----------------+
|     jobs       |
+----------------+
| id (PK)        |
| taskName       |
| payload (JSON) |
| priority       |
| status         |
| createdAt      |
| updatedAt      |
| completedAt    |
+----------------+


1️⃣ Create a Job

Endpoint

POST http://localhost:3000/jobs


Request Body

{
  "taskName": "Generate Report",
  "priority": "High",
  "payload": {
    "reportId": 101,
    "format": "pdf"
  }
}


Expected Result

Job created with status = pending

Job stored in database

Job visible in frontend dashboard

2️⃣ Get All Jobs

Endpoint

GET http://localhost:3000/jobs


Expected Result

Returns all jobs in the database

Used by frontend on page load

3️⃣ Filter Jobs by Status and Priority

Endpoint

GET http://localhost:3000/jobs?status=pending&priority=HIGH


Notes

Filtering is case-insensitive

Both parameters are optional

Valid Values

status: pending, running, completed

priority: Low, Medium, High

4️⃣ Get Job by ID

Endpoint

GET http://localhost:3000/jobs/1


Expected Result

Returns full job details

Used by Job Detail page in frontend

5️⃣ Run a Job (Simulated Execution)

Endpoint

POST http://localhost:3000/run-job/1


Behavior

Changes status: pending → running → completed

Waits 3 seconds

Sets completedAt

Triggers webhook automatically

6️⃣ Test Webhook Manually

Endpoint

POST http://localhost:3000/webhook-test


Request Body

{
  "test": "webhook"
}


Expected Result

Payload received at WEBHOOK_URL

Used only for testing webhook logic

🔔 7. How Webhook Works

Webhook triggers only when job status becomes completed

Backend sends a POST request to WEBHOOK_URL

Webhook Payload Example

{
  "jobId": 1,
  "taskName": "Generate Report",
  "status": "completed",
  "priority": "High",
  "payload": {
    "reportId": 101
  },
  "completedAt": "2026-01-09T13:57:39.000Z"
}


Failures are logged but do not crash the application.


Used AI Chatgpt 5.2 model to generate the backend code.

Sample Prompt:
You are a senior backend engineer with strong experience in Node.js, REST APIs, MySQL, and Sequelize.
Think like you are building an internal automation system similar to a lightweight job scheduler.

GOAL:
Build the backend for a Job Scheduler & Automation Dashboard.
This service allows users to create jobs, run them, track status, and trigger an outbound webhook when jobs complete.

TECH STACK:
- Node.js
- Express.js (REST APIs)
- MySQL
- Sequelize ORM

PROJECT STRUCTURE (MUST FOLLOW):
backend/
├── routes/
├── controllers/
├── services/
├── database/
└── app.js

DATABASE REQUIREMENTS:
Use Sequelize to define and sync a `jobs` table with the following schema:

- id (INT, PK, auto-increment)
- taskName (VARCHAR, required)
- payload (JSON, nullable)
- priority (VARCHAR, required) → allowed values: Low, Medium, High
- status (VARCHAR, required, default: 'pending')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
- completedAt (TIMESTAMP, nullable)

JOB STATUS FLOW (STRICT):
- pending → running → completed
(Optional later: failed — do NOT implement now)

API REQUIREMENTS:

1️⃣ POST /jobs  
Purpose: Create a new job  
Behavior:
- Accept taskName, payload, priority
- status must ALWAYS default to "pending"
- Validate required fields
- Return created job

2️⃣ GET /jobs  
Purpose: List all jobs

3️⃣ GET /jobs/:id  
Purpose: Fetch job by ID  
Behavior:
- Return 404 if job does not exist

4️⃣ POST /run-job/:id  
Purpose: Simulate job execution  
Behavior:
- Fetch job by ID
- Change status from "pending" → "running"
- Simulate processing using a 3-second delay
- After delay:
  - Set status to "completed"
  - Set completedAt timestamp
  - Trigger outbound webhook (see below)
- Return updated job

5️⃣ POST /webhook-test  
Purpose:
- Manually test webhook sending logic (outbound)

OUTBOUND WEBHOOK REQUIREMENTS (MANDATORY):

- When a job status transitions to "completed", send an HTTP POST request to:
  POST https://webhook.site/<your-id>

- Webhook payload MUST include:
  - jobId
  - taskName
  - priority
  - payload
  - completedAt

- Webhook behavior:
  - Fire ONLY once per job completion
  - If webhook fails, log the error (do not crash the app)
  - Webhook logic must live in the services layer

ARCHITECTURE RULES:
- Routes → Controllers → Services (clean separation)
- No business logic inside routes
- Use async/await only
- Proper HTTP status codes
- Environment variables allowed for DB config
- Webhook URL can be hardcoded OR loaded from env

OUTPUT REQUIREMENTS:
- Provide full backend code organized exactly by folder
- Sequelize model definition
- Database connection setup
- app.js setup
- Inline comments where logic matters

ASSUMPTIONS RULE:
- If any requirement is unclear, list assumptions FIRST before writing code.
- Do NOT invent features beyond scope.



Frontend (React + Tailwind)
        |
        | REST APIs
        ↓
Backend (Node.js + Express)
        |
        | Sequelize ORM
        ↓
MySQL Database
        |
        | Outbound HTTP
        ↓
Webhook Receiver (webhook.site)


Used ChatGpt 5.2 model to generate the frontend interface

Prompt Used:

You are a senior frontend engineer with strong experience in React, Tailwind CSS, and REST API integration.
Think like you are building a clean internal automation dashboard for a Job Scheduler system.

GOAL:
Build a modern, clean, and usable frontend dashboard for a Job Scheduler & Automation system.
The UI should allow users to create jobs, view jobs, filter jobs, run jobs, and view job details.

UI / UX REQUIREMENTS (MANDATORY):
1. Clean, modern UI
2. Consistent spacing and typography
3. Good use of Tailwind utility classes
4. Logical and intuitive user flow
5. Dashboard-focused usability (clear actions, clear status)

TECH STACK:
- React (already initialized project, NOT Vite)
- JavaScript (no TypeScript)
- Tailwind CSS
- Fetch API or Axios

ASSUMPTION:
- A React project already exists (e.g. Create React App or custom setup)
- Tailwind CSS is already installed OR should be configured if missing
- Backend is running at http://localhost:3000

BACKEND API DETAILS:
Base URL: http://localhost:3000

Available APIs:
- POST /jobs
- GET /jobs
- GET /jobs?status=&priority=
- GET /jobs/:id
- POST /run-job/:id

NOTE:
- Webhooks are handled entirely by the backend.
- Frontend does NOT interact with webhook APIs.

--------------------------------------------------
STEP 8: FRONTEND – CREATE JOB
--------------------------------------------------

UI REQUIREMENTS:
Create a job creation card or section with:
- Task Name (text input)
- Priority (dropdown: Low, Medium, High)
- Payload (textarea for JSON input)
- Submit button

UX RULES:
- Inputs must have labels
- Inline validation errors
- Disable submit button while request is in progress
- Show a success message after job creation

LOGIC:
1. Collect form values
2. Validate:
   - taskName is required
   - payload must be valid JSON if provided
3. Send POST request to /jobs
4. On success:
   - Clear the form
   - Refresh job list
   - Show success feedback

--------------------------------------------------
STEP 9: FRONTEND – DASHBOARD
--------------------------------------------------

UI REQUIREMENTS:
Dashboard should display:
- Page title (Job Scheduler Dashboard)
- Job creation section
- Filters section
- Jobs table

Jobs table columns:
- ID
- Task Name
- Priority (badge)
- Status (colored badge)
- Created At
- Action

FILTER UI:
- Status dropdown (pending, running, completed)
- Priority dropdown (Low, Medium, High)
- Reset filters button

LOGIC:
1. On page load → fetch /jobs
2. Store jobs in state
3. Render jobs in a responsive table
4. On filter change:
   - Call /jobs?status=&priority=
   - Update job list

--------------------------------------------------
STEP 10: FRONTEND – RUN JOB BUTTON
--------------------------------------------------

UI REQUIREMENTS:
Each job row must have a Run button.

RULES:
- Show Run button ONLY if status is "pending"
- Disable button while job is running
- Show colored status badges:
  - pending → gray
  - running → yellow
  - completed → green

LOGIC:
1. On click → POST /run-job/:id
2. Refresh job list after request
3. UI reflects status transition

--------------------------------------------------
STEP 11: FRONTEND – JOB DETAIL VIEW
--------------------------------------------------

UI REQUIREMENTS:
Create a Job Detail page:
- Route: /jobs/:id

Layout:
- Header with task name
- Status badge
- Metadata section (priority, timestamps)
- Payload section (formatted JSON)

LOGIC:
1. Fetch job details using GET /jobs/:id
2. Display payload using JSON.stringify(payload, null, 2)
3. Handle JSON parsing safely

--------------------------------------------------
STEP 12: END-TO-END TESTING
--------------------------------------------------

TEST CHECKLIST:
1. Create job → appears as pending
2. Apply filters → results update correctly
3. Click job → detail view loads
4. Run job → status updates correctly
5. Confirm webhook triggers (via webhook.site)

EXPECTED FLOW:
Create → Pending → Run → Running → Completed → Webhook

--------------------------------------------------
PROJECT STRUCTURE (MUST FOLLOW):

frontend/
├── pages/
│   ├── Dashboard.jsx
│   └── JobDetail.jsx
├── components/
│   ├── JobForm.jsx
│   ├── JobList.jsx
│   ├── JobFilters.jsx
│   ├── RunJobButton.jsx
│   └── StatusBadge.jsx
├── services/
│   └── api.js
├── styles/
│   └── index.css
├── App.jsx
├── index.js
└── public/
    └── index.html

ARCHITECTURE RULES:
- All API calls must live in services/api.js
- Pages manage layout and data orchestration
- Components must be reusable and focused
- Use React hooks only (useState, useEffect)
- Use Tailwind utility classes (no inline styles)
- Keep code readable and beginner-friendly
- Do NOT add features beyond scope

OUTPUT REQUIREMENTS:
- Generate complete frontend code
- Provide code file-by-file
- Tailwind CSS must be correctly configured
- UI must be clean and usable
- Code must run using:
  npm install
  npm start
