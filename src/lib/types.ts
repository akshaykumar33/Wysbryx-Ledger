export type Role = "Admin";
export type UserRole = "Admin" | "Captain" | "Reviewer";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin";
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  deletedAt?: string | null;
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  leadName?: string;
  deletedAt?: string | null;
}

export interface Designation {
  id: string;
  title: string;
  level: string;
  deletedAt?: string | null;
}

export interface Engineer {
  id: string;
  photoUrl: string;
  fullName: string;
  employeeId: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  teamId: string;
  teamName?: string;
  captainId?: string;
  captainName?: string;
  designationId?: string;
  designationTitle?: string;
  designation: string;
  managerName?: string;
  joiningDate: string;
  experienceYears: number;
  primarySkills: string[];
  secondarySkills: string[];
  status: "Active" | "On Leave" | "In Review";
  avgScore?: number;
  grade?: string;
  rank?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EvaluationCategory {
  id: string;
  name: string;
  description: string;
  weight: number;
  displayOrder: number;
  isArchived?: boolean;
  deletedAt?: string | null;
}

export interface EvaluationParameter {
  id: string;
  categoryId?: string;
  category?: string;
  key: string;
  name: string;
  description: string;
  weight: number;
  submetrics: string[];
  deletedAt?: string | null;
}

export interface ParameterScoreInput {
  parameterId: string;
  categoryId?: string;
  parameterKey: string;
  parameterName: string;
  rating: number; // 1 to 5
  weight: number;
  evidence: string;
  strength?: string;
  improvementSuggestion: string;
  notes?: string;
}

export interface EvaluationCycle {
  id: string;
  title: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  status: "Active" | "Completed" | "Upcoming";
  startDate: string;
  endDate: string;
}

export interface Evaluation {
  id: string;
  cycleTitle?: string;
  cycleId?: string;
  engineerId: string;
  engineerName?: string;
  engineerEmail?: string;
  engineerDesignation?: string;
  engineerDepartment?: string;
  engineerPhoto?: string;
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  reviewerRole?: string;
  evaluationDate: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  overallScore: number;
  percentage: number;
  grade: string;
  gradeLabel: string;
  rank?: number;
  comments: string;
  status: "Completed" | "Draft" | "Archived" | "Pending Review";
  parameterScores: ParameterScoreInput[];
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: "CREATE" | "UPDATE" | "SOFT_DELETE" | "RESTORE" | "BULK_DELETE" | "SETTINGS_CHANGE";
  entityType: "Engineer" | "Evaluation" | "Category" | "Settings" | "System";
  entityId: string;
  oldValues?: string;
  newValues?: string;
  ipAddress: string;
  timestamp: string;
}

export interface GradeBoundary {
  grade: string;
  label: string;
  minScore: number;
  color: string;
  bg: string;
  border: string;
}

export interface SystemSettings {
  companyName: string;
  logoUrl?: string;
  maxScore: number;
  minScore: number;
  ratingScale: number;
  gradeBoundaries: GradeBoundary[];
  activeQuarter: string;
  activeYear: number;
}
