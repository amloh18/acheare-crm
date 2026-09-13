export type PersonContext = 'IN_HOUSE' | 'CANDIDATE' | 'CONTACT' | 'CONTRACTOR';

export type OrganizationRole =
  | 'ADMIN'
  | 'HR'
  | 'RECRUITER'
  | 'BDE'
  | 'MANAGER'
  | 'EMPLOYEE';

export type PersonStatus = 'ACTIVE' | 'INACTIVE' | 'FORMER';

export interface CandidateApplication {
  id: string;
  jobTitle: string;
  department: string;
  stage: 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
  appliedDate: string;
  expectedSalary?: string;
  offeredSalary?: string;
  recruiterName?: string;
  notes?: string;
}

export interface CandidateInterview {
  id: string;
  round: string;
  scheduledAt: string;
  interviewerName: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: string;
}

export interface CandidateProfileData {
  id: string;
  totalExperienceYears: number;
  currentCompany?: string;
  currentDesignation?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  preferredLocation?: string;
  skills: string[];
  resumeUrl?: string;
  applications: CandidateApplication[];
  interviews: CandidateInterview[];
}

export interface EmploymentData {
  id: string;
  employeeCode: string;
  department: string;
  designation: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  joiningDate: string;
  exitDate?: string;
  workLocation: string;
  managerId?: string;
  managerName?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'FORMER';
  salaryMonthly?: string;
}

export interface CompanyRelationshipData {
  companyId: string;
  companyName: string;
  jobTitle: string;
  department?: string;
  isDecisionMaker?: boolean;
  relationshipStatus: 'ACTIVE_CLIENT' | 'PROSPECT' | 'PARTNER';
  opportunitiesCount?: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'PRESENT' | 'REMOTE' | 'ON_LEAVE' | 'LATE';
  checkIn: string;
  checkOut?: string;
  workedHours: number;
}

export interface LeaveRecord {
  id: string;
  type: 'CASUAL' | 'SICK' | 'PAID';
  startDate: string;
  endDate: string;
  days: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface PayslipRecord {
  id: string;
  period: string;
  grossSalary: string;
  netSalary: string;
  status: 'PAID' | 'PROCESSING';
  payDate: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'RESUME' | 'OFFER_LETTER' | 'CONTRACT' | 'PAYSLIP' | 'IDENTIFICATION';
  size: string;
  uploadedAt: string;
  url?: string;
}

export interface UnifiedPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarBg: string;
  initials: string;
  city: string;
  headline?: string;
  inHouse: boolean;
  contexts: PersonContext[];
  roles: OrganizationRole[];
  status: PersonStatus;
  createdAt: string;

  // Attached Business Contexts & Relationships
  employment?: EmploymentData;
  candidateProfile?: CandidateProfileData;
  companyRelationship?: CompanyRelationshipData;
  attendanceHistory?: AttendanceRecord[];
  leaveRecords?: LeaveRecord[];
  payslips?: PayslipRecord[];
  documents?: DocumentItem[];
}
