import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ADMINS (Single Role Governance)
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("Admin"), // Strictly ADMIN
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// DEPARTMENTS
export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  deletedAt: text("deleted_at"),
});

// TEAMS
export const teams = sqliteTable("teams", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  departmentId: text("department_id").notNull(),
  leadName: text("lead_name"),
  deletedAt: text("deleted_at"),
});

// DESIGNATIONS
export const designations = sqliteTable("designations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  level: text("level").notNull(), // IC1, IC2, Senior, Staff, Principal
  deletedAt: text("deleted_at"),
});

// ENGINEERS
export const engineers = sqliteTable("engineers", {
  id: text("id").primaryKey(),
  photoUrl: text("photo_url").notNull(),
  fullName: text("full_name").notNull(),
  employeeId: text("employee_id").notNull().unique(),
  email: text("email").notNull().unique(),
  departmentId: text("department_id").notNull(),
  teamId: text("team_id").notNull(),
  designationId: text("designation_id").notNull(),
  managerName: text("manager_name").notNull(),
  joiningDate: text("joining_date").notNull(),
  experienceYears: real("experience_years").notNull(),
  primarySkills: text("primary_skills").notNull(), // JSON string array
  secondarySkills: text("secondary_skills").notNull(), // JSON string array
  status: text("status").notNull(), // Active, On Leave, In Review
  avgScore: real("avg_score").default(0),
  grade: text("grade").default("N/A"),
  rank: integer("rank"),
  deletedAt: text("deleted_at"), // Soft Delete
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// DYNAMIC EVALUATION CATEGORIES
export const evaluationCategories = sqliteTable("evaluation_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  weight: real("weight").notNull(), // e.g., 10.0
  displayOrder: integer("display_order").notNull(),
  isArchived: integer("is_archived", { mode: "boolean" }).default(false),
  deletedAt: text("deleted_at"),
});

// DYNAMIC EVALUATION PARAMETERS
export const evaluationParameters = sqliteTable("evaluation_parameters", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  key: text("key").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  weight: real("weight").notNull(),
  submetrics: text("submetrics").notNull(), // JSON array
  deletedAt: text("deleted_at"),
});

// EVALUATIONS
export const evaluations = sqliteTable("evaluations", {
  id: text("id").primaryKey(),
  cycleTitle: text("cycle_title").notNull(),
  engineerId: text("engineer_id").notNull(),
  adminId: text("admin_id").notNull(),
  adminName: text("admin_name").notNull(),
  adminEmail: text("admin_email").notNull(),
  evaluationDate: text("evaluation_date").notNull(),
  quarter: text("quarter").notNull(), // Q1, Q2, Q3, Q4
  year: integer("year").notNull(),
  overallScore: real("overall_score").notNull(),
  percentage: real("percentage").notNull(),
  grade: text("grade").notNull(),
  gradeLabel: text("grade_label").notNull(),
  rank: integer("rank"),
  comments: text("comments").notNull(),
  status: text("status").notNull(), // Completed, Draft, Archived
  deletedAt: text("deleted_at"), // Soft delete support
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// EVALUATION PARAMETER SCORES
export const evaluationScores = sqliteTable("evaluation_scores", {
  id: text("id").primaryKey(),
  evaluationId: text("evaluation_id").notNull(),
  categoryId: text("category_id").notNull(),
  parameterId: text("parameter_id").notNull(),
  parameterKey: text("parameter_key").notNull(),
  rating: integer("rating").notNull(), // 1 to 5
  weight: real("weight").notNull(),
  evidence: text("evidence").notNull(),
  strength: text("strength"),
  improvementSuggestion: text("improvement_suggestion").notNull(),
  notes: text("notes"),
  weightedScore: real("weighted_score").notNull(),
});

// AUDIT LOGS
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  adminId: text("admin_id").notNull(),
  adminName: text("admin_name").notNull(),
  action: text("action").notNull(), // CREATE, UPDATE, SOFT_DELETE, RESTORE, BULK_DELETE, SETTINGS_CHANGE
  entityType: text("entity_type").notNull(), // Engineer, Evaluation, Category, Settings
  entityId: text("entity_id").notNull(),
  oldValues: text("old_values"), // JSON
  newValues: text("new_values"), // JSON
  ipAddress: text("ip_address").notNull(),
  timestamp: text("timestamp").notNull(),
});

// SYSTEM SETTINGS (100% Configurable)
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(), // JSON value string
  updatedAt: text("updated_at").notNull(),
});

// ATTACHMENTS
export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  evaluationId: text("evaluation_id").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: text("created_at").notNull(),
});

// NOTIFICATIONS
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
});

// ==========================================
// WORLD 1: WYSIBRYX AI EVALUATION SCHEMA
// ==========================================

// AI EVALUATORS
export const aiEvaluators = sqliteTable("ai_evaluators", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull(),
  allocated: integer("allocated", { mode: "boolean" }).default(false),
  allocatedAt: text("allocated_at"),
  isAdminBypass: integer("is_admin_bypass", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// AI EMPLOYEE ALLOCATIONS
export const aiEmployeeAllocations = sqliteTable("ai_employee_allocations", {
  id: text("id").primaryKey(),
  evaluatorId: text("evaluator_id").notNull(),
  employeeEmail: text("employee_email").notNull(),
  employeeName: text("employee_name").notNull(),
  assignedAt: text("assigned_at").notNull(),
});

// AI QUESTION SETS
export const aiQuestionSets = sqliteTable("ai_question_sets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // System Design, AI Usage, Code Quality, Architecture
  difficulty: text("difficulty").notNull(), // Junior, Mid, Senior, Principal
  content: text("content").notNull(), // Markdown / JSON Rich Text
  weightage: real("weightage").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// AI EVALUATIONS
export const aiEvaluations = sqliteTable("ai_evaluations", {
  id: text("id").primaryKey(),
  evaluatorId: text("evaluator_id").notNull(),
  employeeEmail: text("employee_email").notNull(),
  employeeName: text("employee_name").notNull(),
  overallScore: real("overall_score").default(0),
  percentage: real("percentage").default(0),
  grade: text("grade").default("Pending"),
  status: text("status").notNull().default("Draft"), // Draft, Completed, Under Review
  feedback: text("feedback"),
  summary: text("summary"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// AI EVALUATION PARAMETER SCORES
export const aiEvaluationScores = sqliteTable("ai_evaluation_scores", {
  id: text("id").primaryKey(),
  evaluationId: text("evaluation_id").notNull(),
  questionSetId: text("question_set_id"),
  parameterName: text("parameter_name").notNull(),
  parameterKey: text("parameter_key").notNull(),
  rating: integer("rating").notNull(), // 1 to 10
  weight: real("weight").notNull(),
  score: real("score").notNull(),
  evidence: text("evidence"),
  strength: text("strength"),
  improvementSuggestion: text("improvement_suggestion"),
  notes: text("notes"),
});

// AI NOTES & TIMELINE
export const aiNotes = sqliteTable("ai_notes", {
  id: text("id").primaryKey(),
  evaluationId: text("evaluation_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
});

