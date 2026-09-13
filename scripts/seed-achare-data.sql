-- ====================================================================
-- Achare Business Operating System - Seed Realistic Unified People Data
-- Target Schema: workspace_1wgvd1injqtife6y4rvfbu3h5 (Apple Workspace)
-- ====================================================================

SET search_path TO workspace_1wgvd1injqtife6y4rvfbu3h5, public;

-- 1. Departments
INSERT INTO "department" ("id", "name", "description", "status", "createdAt", "updatedAt")
VALUES
  ('30303030-de01-4000-8000-000000000001', 'Engineering', 'Product Engineering & Architecture', 'ACTIVE', NOW(), NOW()),
  ('30303030-de01-4000-8000-000000000002', 'Design', 'Product Design & UX Systems', 'ACTIVE', NOW(), NOW()),
  ('30303030-de01-4000-8000-000000000003', 'Sales & BD', 'Revenue & Strategic Partnerships', 'ACTIVE', NOW(), NOW()),
  ('30303030-de01-4000-8000-000000000004', 'Human Resources', 'People Operations & Talent Acquisition', 'ACTIVE', NOW(), NOW()),
  ('30303030-de01-4000-8000-000000000005', 'Finance', 'Financial Operations & Payroll', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 2. Designations
INSERT INTO "designation" ("id", "title", "level", "description", "status", "createdAt", "updatedAt")
VALUES
  ('30303030-de02-4000-8000-000000000001', 'Principal Engineer', 'LEAD', 'Lead Architect', 'ACTIVE', NOW(), NOW()),
  ('30303030-de02-4000-8000-000000000002', 'Senior Backend Engineer', 'SENIOR', 'Core Services & DB', 'ACTIVE', NOW(), NOW()),
  ('30303030-de02-4000-8000-000000000003', 'Staff Product Designer', 'LEAD', 'Design Systems & UX', 'ACTIVE', NOW(), NOW()),
  ('30303030-de02-4000-8000-000000000004', 'VP of Sales', 'VP', 'Enterprise Revenue', 'ACTIVE', NOW(), NOW()),
  ('30303030-de02-4000-8000-000000000005', 'Head of People Operations', 'DIRECTOR', 'People Ops Leader', 'ACTIVE', NOW(), NOW()),
  ('30303030-de02-4000-8000-000000000006', 'Senior Financial Analyst', 'SENIOR', 'FP&A and Payroll', 'ACTIVE', NOW(), NOW()),
  ('30303030-de02-4000-8000-000000000007', 'Senior Recruiter', 'SENIOR', 'Technical Talent Partner', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 3. Canonical People Directory (Master Human Records)
INSERT INTO "person" (
  "id",
  "nameFirstName",
  "nameLastName",
  "jobTitle",
  "city",
  "inHouse",
  "contexts",
  "roles",
  "status",
  "emails",
  "phones",
  "createdAt",
  "updatedAt"
)
VALUES
  ('20202020-0001-4000-8000-000000000001', 'Aarav', 'Patel', 'Principal Engineer', 'Bangalore', true, ARRAY['IN_HOUSE'], ARRAY['EMPLOYEE', 'MANAGER'], 'ACTIVE', '{"primaryEmail": "aarav.patel@achare.com"}', '{"primaryPhone": "+91 98765 43210"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000002', 'Rohan', 'Mehta', 'Staff Product Designer', 'Bangalore', true, ARRAY['IN_HOUSE'], ARRAY['EMPLOYEE'], 'ACTIVE', '{"primaryEmail": "rohan.mehta@achare.com"}', '{"primaryPhone": "+91 98765 43211"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000003', 'Vikram', 'Sengupta', 'VP of Sales', 'Mumbai', true, ARRAY['IN_HOUSE'], ARRAY['BDE', 'MANAGER'], 'ACTIVE', '{"primaryEmail": "vikram.sengupta@achare.com"}', '{"primaryPhone": "+91 98765 43212"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000004', 'Kavita', 'Sundaram', 'Head of People Operations', 'Bangalore', true, ARRAY['IN_HOUSE'], ARRAY['HR', 'MANAGER'], 'ACTIVE', '{"primaryEmail": "kavita.sundaram@achare.com"}', '{"primaryPhone": "+91 98765 43213"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000005', 'Devon', 'Wright', 'Senior Financial Analyst', 'Bangalore', true, ARRAY['IN_HOUSE'], ARRAY['EMPLOYEE'], 'ACTIVE', '{"primaryEmail": "devon.wright@achare.com"}', '{"primaryPhone": "+91 98765 43214"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000006', 'Aisha', 'Khan', 'Senior Backend Engineer', 'Bangalore', true, ARRAY['IN_HOUSE'], ARRAY['EMPLOYEE'], 'ACTIVE', '{"primaryEmail": "aisha.khan@achare.com"}', '{"primaryPhone": "+91 98765 43215"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000007', 'Sarah', 'Jenkins', 'Talent Recruiter', 'Bangalore', true, ARRAY['IN_HOUSE'], ARRAY['RECRUITER'], 'ACTIVE', '{"primaryEmail": "sarah.jenkins@achare.com"}', '{"primaryPhone": "+91 98765 43216"}', NOW(), NOW()),
  -- Lifecycle Demonstration: Rahul Verma was Candidate, Hired, now active In-House Employee!
  ('20202020-0001-4000-8000-000000000008', 'Rahul', 'Verma', 'Backend Architect', 'Bangalore', true, ARRAY['IN_HOUSE', 'CANDIDATE'], ARRAY['EMPLOYEE'], 'ACTIVE', '{"primaryEmail": "rahul.verma@achare.com"}', '{"primaryPhone": "+91 98765 43217"}', NOW(), NOW()),
  -- Candidate Only
  ('20202020-0001-4000-8000-000000000009', 'Priya', 'Sharma', 'Senior Frontend Dev', 'Bangalore', false, ARRAY['CANDIDATE'], NULL, 'ACTIVE', '{"primaryEmail": "priya.sharma@gmail.com"}', '{"primaryPhone": "+91 98765 43218"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000010', 'Marcus', 'Vance', 'Lead UI/UX Designer', 'Remote', false, ARRAY['CANDIDATE'], NULL, 'ACTIVE', '{"primaryEmail": "marcus.vance@design.co"}', '{"primaryPhone": "+91 98765 43219"}', NOW(), NOW()),
  ('20202020-0001-4000-8000-000000000011', 'Neha', 'Kapoor', 'Talent Partner', 'Bangalore', false, ARRAY['CANDIDATE'], NULL, 'ACTIVE', '{"primaryEmail": "neha.kapoor@talent.io"}', '{"primaryPhone": "+91 98765 43220"}', NOW(), NOW()),
  -- Multi-Context: Candidate AND Contact (Acme Technologies)
  ('20202020-0001-4000-8000-000000000012', 'Michael', 'Brown', 'VP of Engineering', 'Mumbai', false, ARRAY['CANDIDATE', 'CONTACT'], NULL, 'ACTIVE', '{"primaryEmail": "mbrown@acme.com"}', '{"primaryPhone": "+1 415 555 2671"}', NOW(), NOW()),
  -- Client Contact Only (Acme Technologies)
  ('20202020-0001-4000-8000-000000000013', 'Lisa', 'Vance', 'Director of Procurement', 'San Francisco', false, ARRAY['CONTACT'], NULL, 'ACTIVE', '{"primaryEmail": "lvance@globex.com"}', '{"primaryPhone": "+1 415 555 7890"}', NOW(), NOW()),
  -- Client Contact Only
  ('20202020-0001-4000-8000-000000000014', 'David', 'Miller', 'Chief Technology Officer', 'Austin', false, ARRAY['CONTACT'], NULL, 'ACTIVE', '{"primaryEmail": "dmiller@stark.io"}', '{"primaryPhone": "+1 512 555 4321"}', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "inHouse" = EXCLUDED."inHouse",
  "contexts" = EXCLUDED."contexts",
  "roles" = EXCLUDED."roles",
  "status" = EXCLUDED."status",
  "city" = EXCLUDED."city";

-- 4. Employees (Linked to Canonical Person via personId)
INSERT INTO "employee" (
  "id",
  "personId",
  "employeeCode",
  "status",
  "employmentType",
  "joiningDate",
  "workLocation",
  "departmentId",
  "designationId",
  "managerId",
  "createdAt",
  "updatedAt"
)
VALUES
  ('30303030-ee01-4000-8000-000000000001', '20202020-0001-4000-8000-000000000001', 'ACH-001', 'ACTIVE', 'FULL_TIME', '2023-01-15', 'Bangalore HQ', '30303030-de01-4000-8000-000000000001', '30303030-de02-4000-8000-000000000001', NULL, NOW(), NOW()),
  ('30303030-ee01-4000-8000-000000000002', '20202020-0001-4000-8000-000000000002', 'ACH-002', 'ACTIVE', 'FULL_TIME', '2023-03-01', 'Bangalore HQ', '30303030-de01-4000-8000-000000000002', '30303030-de02-4000-8000-000000000003', '30303030-ee01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-ee01-4000-8000-000000000003', '20202020-0001-4000-8000-000000000003', 'ACH-003', 'ACTIVE', 'FULL_TIME', '2023-04-10', 'Mumbai Office', '30303030-de01-4000-8000-000000000003', '30303030-de02-4000-8000-000000000004', NULL, NOW(), NOW()),
  ('30303030-ee01-4000-8000-000000000004', '20202020-0001-4000-8000-000000000004', 'ACH-004', 'ACTIVE', 'FULL_TIME', '2023-05-15', 'Bangalore HQ', '30303030-de01-4000-8000-000000000004', '30303030-de02-4000-8000-000000000005', NULL, NOW(), NOW()),
  ('30303030-ee01-4000-8000-000000000005', '20202020-0001-4000-8000-000000000005', 'ACH-005', 'ACTIVE', 'FULL_TIME', '2023-06-20', 'Bangalore HQ', '30303030-de01-4000-8000-000000000005', '30303030-de02-4000-8000-000000000006', NULL, NOW(), NOW()),
  ('30303030-ee01-4000-8000-000000000006', '20202020-0001-4000-8000-000000000006', 'ACH-006', 'ACTIVE', 'FULL_TIME', '2023-08-01', 'Bangalore HQ', '30303030-de01-4000-8000-000000000001', '30303030-de02-4000-8000-000000000002', '30303030-ee01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-ee01-4000-8000-000000000007', '20202020-0001-4000-8000-000000000007', 'ACH-007', 'ACTIVE', 'FULL_TIME', '2023-09-01', 'Bangalore HQ', '30303030-de01-4000-8000-000000000004', '30303030-de02-4000-8000-000000000007', '30303030-ee01-4000-8000-000000000004', NOW(), NOW()),
  -- Rahul Verma active employment
  ('30303030-ee01-4000-8000-000000000008', '20202020-0001-4000-8000-000000000008', 'ACH-008', 'ACTIVE', 'FULL_TIME', '2026-09-01', 'Bangalore HQ', '30303030-de01-4000-8000-000000000001', '30303030-de02-4000-8000-000000000002', '30303030-ee01-4000-8000-000000000001', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "personId" = EXCLUDED."personId",
  "managerId" = EXCLUDED."managerId";

-- 5. Candidate Profiles (Linked to Canonical Person via personId)
INSERT INTO "candidate" (
  "id",
  "personId",
  "name",
  "source",
  "currentDesignation",
  "currentCompany",
  "totalExperienceYears",
  "noticePeriod",
  "preferredLocation",
  "status",
  "createdAt",
  "updatedAt"
)
VALUES
  ('30303030-ce01-4000-8000-000000000001', '20202020-0001-4000-8000-000000000009', 'Priya Sharma', 'LINKEDIN', 'Senior Frontend Dev', 'Infosys', 6, 'IMMEDIATE', 'Bangalore', 'ACTIVE', NOW(), NOW()),
  ('30303030-ce01-4000-8000-000000000002', '20202020-0001-4000-8000-000000000010', 'Marcus Vance', 'JOB_PORTAL', 'Lead UI/UX Designer', 'DesignStudio', 8, 'D30', 'Remote', 'ACTIVE', NOW(), NOW()),
  -- Rahul Verma candidate profile (preserves recruitment history!)
  ('30303030-ce01-4000-8000-000000000003', '20202020-0001-4000-8000-000000000008', 'Rahul Verma', 'REFERRAL', 'Backend Architect', 'Swiggy', 7, 'D15', 'Bangalore', 'PLACED', NOW(), NOW()),
  ('30303030-ce01-4000-8000-000000000004', '20202020-0001-4000-8000-000000000011', 'Neha Kapoor', 'LINKEDIN', 'Talent Partner', 'Zomato', 4, 'IMMEDIATE', 'Bangalore', 'ACTIVE', NOW(), NOW()),
  ('30303030-ce01-4000-8000-000000000005', '20202020-0001-4000-8000-000000000012', 'Michael Brown', 'REFERRAL', 'VP of Engineering', 'Acme Technologies', 12, 'D30', 'Mumbai', 'ACTIVE', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "personId" = EXCLUDED."personId",
  "status" = EXCLUDED."status";

-- 6. Job Requirements
INSERT INTO "requirement" (
  "id",
  "title",
  "position",
  "numberOfOpenings",
  "filledCount",
  "location",
  "workMode",
  "employmentType",
  "priority",
  "status",
  "createdAt",
  "updatedAt"
)
VALUES
  ('30303030-fe01-4000-8000-000000000001', 'Senior Full Stack Engineer', 1, 3, 1, 'Bangalore', 'HYBRID', 'FULL_TIME', 'HIGH', 'IN_PROGRESS', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000002', 'Lead Product Designer', 2, 1, 0, 'Remote', 'REMOTE', 'FULL_TIME', 'HIGH', 'IN_PROGRESS', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000003', 'Enterprise Account Executive', 3, 2, 0, 'Mumbai', 'ON_SITE', 'FULL_TIME', 'MEDIUM', 'IN_PROGRESS', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000004', 'Talent Acquisition Specialist', 4, 2, 1, 'Bangalore', 'HYBRID', 'FULL_TIME', 'MEDIUM', 'IN_PROGRESS', NOW(), NOW()),
  ('30303030-fe01-4000-8000-000000000005', 'DevOps & Cloud Architect', 5, 1, 0, 'Remote', 'REMOTE', 'FULL_TIME', 'HIGH', 'IN_PROGRESS', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 7. Candidate Submissions (Applications)
INSERT INTO "candidateSubmission" (
  "id",
  "name",
  "stage",
  "candidateId",
  "requirementId",
  "createdAt",
  "updatedAt"
)
VALUES
  ('30303030-be01-4000-8000-000000000001', 'Priya Sharma - Senior Full Stack', 'INTERVIEW', '30303030-ce01-4000-8000-000000000001', '30303030-fe01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000002', 'Marcus Vance - Lead Designer', 'INTERVIEW', '30303030-ce01-4000-8000-000000000002', '30303030-fe01-4000-8000-000000000002', NOW(), NOW()),
  -- Rahul Verma application marked HIRED/JOINED (completing the full lifecycle)
  ('30303030-be01-4000-8000-000000000003', 'Rahul Verma - Backend Architect', 'JOINED', '30303030-ce01-4000-8000-000000000003', '30303030-fe01-4000-8000-000000000001', NOW() - INTERVAL '10 days', NOW()),
  ('30303030-be01-4000-8000-000000000004', 'Neha Kapoor - Recruiter', 'SCREENING', '30303030-ce01-4000-8000-000000000004', '30303030-fe01-4000-8000-000000000004', NOW(), NOW()),
  ('30303030-be01-4000-8000-000000000005', 'Michael Brown - Advisory VP', 'OFFER', '30303030-ce01-4000-8000-000000000005', '30303030-fe01-4000-8000-000000000005', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "stage" = EXCLUDED."stage";

-- 8. Scheduled Interviews
INSERT INTO "interview" ("id", "title", "round", "interviewer", "scheduledAt", "status", "candidateId", "requirementId", "createdAt", "updatedAt")
VALUES
  ('30303030-ae01-4000-8000-000000000001', 'Technical Interview - Priya Sharma', 'ROUND_2', 'Aarav Patel', NOW() + INTERVAL '2 hours', 'SCHEDULED', '30303030-ce01-4000-8000-000000000001', '30303030-fe01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-ae01-4000-8000-000000000002', 'Design Portfolio - Marcus Vance', 'ROUND_1', 'Rohan Mehta', NOW() + INTERVAL '4 hours', 'SCHEDULED', '30303030-ce01-4000-8000-000000000002', '30303030-fe01-4000-8000-000000000002', NOW(), NOW()),
  ('30303030-ae01-4000-8000-000000000003', 'Culture Fit - Neha Kapoor', 'HR_ROUND', 'Vikram Sengupta', NOW() + INTERVAL '1 day', 'SCHEDULED', '30303030-ce01-4000-8000-000000000004', '30303030-fe01-4000-8000-000000000004', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 9. Attendance
INSERT INTO "attendanceDay" ("id", "workDate", "status", "firstCheckIn", "workedMinutes", "employeeId", "createdAt", "updatedAt")
VALUES
  ('30303030-ad01-4000-8000-000000000001', CURRENT_DATE, 'PRESENT', NOW() - INTERVAL '5 hours', 300, '30303030-ee01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-ad01-4000-8000-000000000002', CURRENT_DATE, 'PRESENT', NOW() - INTERVAL '4 hours', 240, '30303030-ee01-4000-8000-000000000002', NOW(), NOW()),
  ('30303030-ad01-4000-8000-000000000003', CURRENT_DATE, 'PRESENT', NOW() - INTERVAL '4 hours 30 minutes', 270, '30303030-ee01-4000-8000-000000000003', NOW(), NOW()),
  ('30303030-ad01-4000-8000-000000000004', CURRENT_DATE, 'PRESENT', NOW() - INTERVAL '5 hours', 300, '30303030-ee01-4000-8000-000000000004', NOW(), NOW()),
  ('30303030-ad01-4000-8000-000000000005', CURRENT_DATE, 'PRESENT', NOW() - INTERVAL '3 hours', 180, '30303030-ee01-4000-8000-000000000005', NOW(), NOW()),
  ('30303030-ad01-4000-8000-000000000006', CURRENT_DATE, 'PRESENT', NOW() - INTERVAL '5 hours', 300, '30303030-ee01-4000-8000-000000000006', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- 10. Payroll
INSERT INTO "payrollPeriod" ("id", "name", "startDate", "endDate", "payDate", "status", "employeeCount", "createdAt", "updatedAt")
VALUES
  ('30303030-ba01-4000-8000-000000000001', 'August 2026 Cycle', '2026-08-01', '2026-08-31', '2026-08-31', 'PAID', 48, NOW(), NOW()),
  ('30303030-ba01-4000-8000-000000000002', 'July 2026 Cycle', '2026-07-01', '2026-07-31', '2026-07-31', 'PAID', 45, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "payslip" ("id", "paymentStatus", "paidAt", "payrollPeriodId", "employeeId", "createdAt", "updatedAt")
VALUES
  ('30303030-bb01-4000-8000-000000000001', 'PAID', '2026-08-31', '30303030-ba01-4000-8000-000000000001', '30303030-ee01-4000-8000-000000000001', NOW(), NOW()),
  ('30303030-bb01-4000-8000-000000000002', 'PAID', '2026-08-31', '30303030-ba01-4000-8000-000000000001', '30303030-ee01-4000-8000-000000000002', NOW(), NOW()),
  ('30303030-bb01-4000-8000-000000000003', 'PAID', '2026-08-31', '30303030-ba01-4000-8000-000000000001', '30303030-ee01-4000-8000-000000000003', NOW(), NOW()),
  ('30303030-bb01-4000-8000-000000000004', 'PAID', '2026-08-31', '30303030-ba01-4000-8000-000000000001', '30303030-ee01-4000-8000-000000000004', NOW(), NOW()),
  ('30303030-bb01-4000-8000-000000000005', 'PAID', '2026-08-31', '30303030-ba01-4000-8000-000000000001', '30303030-ee01-4000-8000-000000000005', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
