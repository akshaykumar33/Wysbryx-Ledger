import { Evaluation } from "./types";

export function exportToCSV(evaluations: Evaluation[], filename: string = "evaluations_export.csv") {
  if (!evaluations || evaluations.length === 0) return;

  const headers = [
    "Evaluation ID",
    "Engineer Name",
    "Email",
    "Designation",
    "Department",
    "Reviewer Name",
    "Quarter",
    "Year",
    "Overall Score",
    "Percentage",
    "Grade",
    "Status",
    "Date",
  ];

  const rows = evaluations.map((item) => [
    `"${item.id}"`,
    `"${item.engineerName || ""}"`,
    `"${item.engineerEmail || ""}"`,
    `"${item.engineerDesignation || ""}"`,
    `"${item.engineerDepartment || ""}"`,
    `"${item.reviewerName || ""}"`,
    `"${item.quarter}"`,
    item.year,
    item.overallScore.toFixed(1),
    `${item.percentage.toFixed(1)}%`,
    `"${item.grade} (${item.gradeLabel})"`,
    `"${item.status}"`,
    `"${item.evaluationDate}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any, filename: string = "evaluation_report.json") {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printPDFReport() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
