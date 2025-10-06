import { createClient } from "@/utils/supabase/client";
import { TeamMember, TeamMemberFormData } from "@/types/team";

const supabase = createClient();

// Get all team members (active only for public)
export async function getTeamMembers(
  includeInactive = false
): Promise<TeamMember[]> {
  let query = supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }

  return data || [];
}

// Get single team member by ID
export async function getTeamMemberById(
  id: string
): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching team member:", error);
    throw error;
  }

  return data;
}

// Create new team member
export async function createTeamMember(
  memberData: Partial<TeamMemberFormData>
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .insert([
      {
        name: memberData.name || "",
        role: memberData.role || "",
        image: memberData.image || "",
        bio: memberData.bio || "",
        email: memberData.email || null,
        phone: memberData.phone || null,
        linkedin: memberData.linkedin || null,
        twitter: memberData.twitter || null,
        facebook: memberData.facebook || null,
        instagram: memberData.instagram || null,
        specialties: memberData.specialties || [],
        experience: memberData.experience || "",
        display_order: memberData.display_order || 0,
        is_active: memberData.is_active ?? true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating team member:", error);
    throw error;
  }

  return data;
}

// Update team member
export async function updateTeamMember(
  id: string,
  memberData: Partial<TeamMemberFormData>
): Promise<TeamMember> {
  const updateData: Partial<TeamMember> = {
    name: memberData.name,
    role: memberData.role,
    image: memberData.image,
    bio: memberData.bio,
    email: memberData.email || null,
    phone: memberData.phone || null,
    linkedin: memberData.linkedin || null,
    twitter: memberData.twitter || null,
    facebook: memberData.facebook || null,
    instagram: memberData.instagram || null,
    specialties: memberData.specialties,
    experience: memberData.experience,
    display_order: memberData.display_order,
    is_active: memberData.is_active,
  };

  const { data, error } = await supabase
    .from("team_members")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating team member:", error);
    throw error;
  }

  return data;
}

// Delete team member
export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    throw error;
  }
}

// Reorder team members
export async function reorderTeamMembers(
  updates: { id: string; display_order: number }[]
): Promise<void> {
  const promises = updates.map(({ id, display_order }) =>
    supabase.from("team_members").update({ display_order }).eq("id", id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    console.error("Error reordering team members:", errors);
    throw new Error("Failed to reorder team members");
  }
}
