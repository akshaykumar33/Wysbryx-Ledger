"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { UserPlus, X, Save, User, Mail, Briefcase, Award, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { DEPARTMENTS, TEAMS, DESIGNATIONS } from "@/lib/constants";
import { Engineer } from "@/lib/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { toast } from "sonner";

interface AddEngineerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (engineer: Engineer) => void;
}

export function AddEngineerModal({ open, onOpenChange, onSuccess }: AddEngineerModalProps) {
  const { addEngineer } = useAppStore();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [employeeId, setEmployeeId] = React.useState("");
  const [departmentId, setDepartmentId] = React.useState(DEPARTMENTS[0]?.id || "dept_eng");
  const [teamId, setTeamId] = React.useState(TEAMS[0]?.id || "team_fe");
  const [designationTitle, setDesignationTitle] = React.useState(DESIGNATIONS[0]?.title || "Senior Software Engineer");
  const [managerName, setManagerName] = React.useState("Executive Administrator");
  const [experienceYears, setExperienceYears] = React.useState("3.5");
  const [primarySkillsStr, setPrimarySkillsStr] = React.useState("TypeScript, React, Next.js");
  const [joiningDate, setJoiningDate] = React.useState(new Date().toISOString().split("T")[0]);

  const departmentOptions = DEPARTMENTS.map((d) => ({ value: d.id, label: d.name }));
  const teamOptions = TEAMS.map((t) => ({ value: t.id, label: t.name }));
  const designationOptions = DESIGNATIONS.map((d) => ({ value: d.title, label: `${d.title} (${d.level})` }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      toast.error("Please enter engineer name and email");
      return;
    }

    const selectedDept = DEPARTMENTS.find((d) => d.id === departmentId);
    const selectedTeam = TEAMS.find((t) => t.id === teamId);
    const primarySkills = primarySkillsStr.split(",").map((s) => s.trim()).filter(Boolean);

    const newEng: Engineer = {
      id: `eng_${Date.now()}`,
      employeeId: employeeId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      email: email.trim(),
      photoUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      departmentId,
      departmentName: selectedDept?.name || "Engineering",
      teamId,
      teamName: selectedTeam?.name || "Product Team",
      designationId: "desig_snr",
      designation: designationTitle,
      managerName: managerName.trim() || "Executive Administrator",
      joiningDate: joiningDate || new Date().toISOString().split("T")[0],
      experienceYears: parseFloat(experienceYears) || 3.0,
      primarySkills: primarySkills.length > 0 ? primarySkills : ["TypeScript", "Fullstack"],
      secondarySkills: ["System Architecture", "GraphQL"],
      status: "Active",
      avgScore: 85.0,
      grade: "A",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addEngineer(newEng);
    toast.success(`User/Engineer added successfully!`, {
      description: `${newEng.fullName} (${newEng.designation})`,
    });

    if (onSuccess) onSuccess(newEng);
    onOpenChange(false);

    // Reset form
    setFullName("");
    setEmail("");
    setEmployeeId("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl space-y-6 text-neutral-900 dark:text-white max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-neutral-900 dark:text-white">
                  Add User for Evaluation
                </Dialog.Title>
                <Dialog.Description className="text-xs text-neutral-500 mt-0.5">
                  Create a new engineer profile to perform quarterly performance reviews.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="maya@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Employee ID & Experience Years */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Employee ID</label>
                <input
                  type="text"
                  placeholder="EMP-9021"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Department & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Department</label>
                <CustomSelect
                  options={departmentOptions}
                  value={departmentId}
                  onChange={(val) => setDepartmentId(val)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Designation</label>
                <CustomSelect
                  options={designationOptions}
                  value={designationTitle}
                  onChange={(val) => setDesignationTitle(val)}
                />
              </div>
            </div>

            {/* Joining Date & Primary Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Joining Date</label>
                <DatePicker value={joiningDate} onChange={(d) => setJoiningDate(d)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Primary Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="TypeScript, Node.js, Python"
                  value={primarySkillsStr}
                  onChange={(e) => setPrimarySkillsStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Add Engineer</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
