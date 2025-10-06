"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { createTeamMember } from "@/lib/supabase/team";
import { TeamMemberForm } from "@/components/Admin/Team/TeamMemberForm";
import { TeamMemberFormData } from "@/types/team";
import DashboardLayout from "@/components/Admin/DashboardLayout";

export default function CreateTeamMemberPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const initialData: TeamMemberFormData = {
    name: "",
    role: "",
    image: "",
    bio: "",
    email: "",
    phone: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    specialties: [],
    experience: "",
    display_order: 0,
    is_active: true,
  };

  const handleSubmit = async (formData: TeamMemberFormData) => {
    try {
      setSaving(true);
      await createTeamMember(formData);
      toast.success("Team member created successfully");
      router.push("/admin/team");
    } catch (error) {
      console.error("Error creating team member:", error);
      toast.error("Failed to create team member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Icon icon="ph:arrow-left" width={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add Team Member
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new team member profile
              </p>
            </div>
          </div>
        </div>

        <TeamMemberForm
          initialData={initialData}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Create Team Member"
        />
      </div>
    </DashboardLayout>
  );
}
