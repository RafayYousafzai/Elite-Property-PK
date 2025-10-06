"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { getTeamMemberById, updateTeamMember } from "@/lib/supabase/team";
import { TeamMemberForm } from "@/components/Admin/Team/TeamMemberForm";
import { TeamMember, TeamMemberFormData } from "@/types/team";
import DashboardLayout from "@/components/Admin/DashboardLayout";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await getTeamMemberById(id);
        setMember(data);
      } catch (error) {
        console.error("Error fetching team member:", error);
        toast.error("Failed to load team member");
        router.push("/admin/team");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id, router]);

  const handleSubmit = async (formData: TeamMemberFormData) => {
    try {
      setSaving(true);
      await updateTeamMember(id, formData);
      toast.success("Team member updated successfully");
      router.push("/admin/team");
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-3 border-gray-200 dark:border-gray-700 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon
            icon="ph:user-x"
            width={64}
            height={64}
            className="text-gray-300 dark:text-gray-700 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Team Member Not Found
          </h2>
          <button
            onClick={() => router.push("/admin/team")}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-300"
          >
            Back to Team
          </button>
        </div>
      </div>
    );
  }

  const initialData: TeamMemberFormData = {
    name: member.name,
    role: member.role,
    image: member.image,
    bio: member.bio,
    email: member.email || "",
    phone: member.phone || "",
    linkedin: member.linkedin || "",
    twitter: member.twitter || "",
    facebook: member.facebook || "",
    instagram: member.instagram || "",
    specialties: member.specialties,
    experience: member.experience,
    display_order: member.display_order,
    is_active: member.is_active,
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
                Edit Team Member
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update team member information
              </p>
            </div>
          </div>
        </div>

        <TeamMemberForm
          initialData={initialData}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Update Team Member"
        />
      </div>
    </DashboardLayout>
  );
}
