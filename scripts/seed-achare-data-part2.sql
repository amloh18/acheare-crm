SET search_path TO workspace_1wgvd1injqtife6y4rvfbu3h5, public;

-- 4. Job Requirements
INSERT INTO "requirement" ("id", "title", "position", "numberOfOpenings", "filledCount", "location", "workMode", "employmentType", "priority", "status", "companyId", "createdAt", "updatedAt")
VALUES
  ('30303030-fe01-4000-8000-000000000001', 'Senior Full Stack Engineer', 1, 3, 1, 'Bangalore', 'HYBRID', 'FULL_TIME', 'HIGH', 'IN_PROGRESS', '20202020-a305-41e7-8c72-ba44072a4c58', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000002', 'Lead Product Designer', 2, 1, 0, 'Remote', 'REMOTE', 'FULL_TIME', 'HIGH', 'IN_PROGRESS', '20202020-a225-4b3d-a89c-7f6c30df998a', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000003', 'Enterprise Account Executive', 3, 2, 0, 'Mumbai', 'ON_SITE', 'FULL_TIME', 'MEDIUM', 'IN_PROGRESS', '20202020-a8b0-422c-8fcf-5b7496f94975', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000004', 'Talent Acquisition Specialist', 4, 2, 1, 'Bangalore', 'HYBRID', 'FULL_TIME', 'MEDIUM', 'IN_PROGRESS', '20202020-aaf7-41d6-87a9-7add07bebfd8', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000005', 'DevOps & Cloud Architect', 5, 1, 0, 'Remote', 'REMOTE', 'FULL_TIME', 'HIGH', 'IN_PROGRESS', '20202020-a305-41e7-8c72-ba44072a4c58', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 6. Candidate Submissions
INSERT INTO "candidateSubmission" ("id", "name", "stage", "candidateId", "requirementId", "createdAt", "updatedAt")
VALUES
  ('30303030-be01-4000-8000-000000000001', 'Priya Sharma - Full Stack', 'INTERVIEW', '30303030-ce01-4000-8000-000000000001', '30303030-fe01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000002', 'Marcus Vance - Lead Designer', 'INTERVIEW', '30303030-ce01-4000-8000-000000000002', '30303030-fe01-4000-8000-000000000002', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000003', 'Rahul Verma - Backend Architect', 'OFFER', '30303030-ce01-4000-8000-000000000003', '30303030-fe01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000004', 'Neha Kapoor - Recruiter', 'SCREENING', '30303030-ce01-4000-8000-000000000004', '30303030-fe01-4000-8000-000000000004', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000005', 'Alex Chen - Full Stack', 'SOURCED', '30303030-ce01-4000-8000-000000000005', '30303030-fe01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000006', 'Ananya Roy - Engineering Lead', 'JOINED', '30303030-ce01-4000-8000-000000000006', '30303030-fe01-4000-8000-000000000005', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 7. Scheduled Interviews
INSERT INTO "interview" ("id", "title", "round", "interviewer", "scheduledAt", "status", "candidateId", "requirementId", "createdAt", "updatedAt")
VALUES
  ('30303030-ae01-4000-8000-000000000001', 'Technical Interview - Priya Sharma', 'ROUND_2', 'Aarav Patel', NOW() + INTERVAL '2 hours', 'SCHEDULED', '30303030-ce01-4000-8000-000000000001', '30303030-fe01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-ae01-4000-8000-000000000002', 'Design Portfolio - Marcus Vance', 'ROUND_1', 'Rohan Mehta', NOW() + INTERVAL '4 hours', 'SCHEDULED', '30303030-ce01-4000-8000-000000000002', '30303030-fe01-4000-8000-000000000002', NOW(), NOW()),
  ('30303030-ae01-4000-8000-000000000003', 'Culture Fit - Neha Kapoor', 'HR_ROUND', 'Vikram Sengupta', NOW() + INTERVAL '1 day', 'SCHEDULED', '30303030-ce01-4000-8000-000000000004', '30303030-fe01-4000-8000-000000000004', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
