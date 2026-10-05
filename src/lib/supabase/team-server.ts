import { createStaticClient } from "@/utils/supabase/static";
import { TeamMember } from "@/types/team";

// Server-side fetch of active team members (cookie-less so the page stays static)
export async function getTeamMembersServer(): Promise<TeamMember[]> {
  try {
    const supabase = createStaticClient();

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching team members:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTeamMembersServer:", error);
    return [];
  }
}
