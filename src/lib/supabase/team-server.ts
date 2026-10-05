import { createStaticClient } from "@/utils/supabase/static";
import { TeamMember } from "@/types/team";

const COLUMNS =
  "id,name,role,bio,email,phone,linkedin,twitter,facebook,instagram,specialties,experience,display_order,is_active,created_at,updated_at";

// Server-side fetch of active team members (cookie-less so the page stays static).
// Some older photos are stored in the row as base64 data URIs (several MB);
// those are never sent to the page — they're served as real images by
// /api/team-photo instead, so the HTML stays small.
export async function getTeamMembersServer(): Promise<TeamMember[]> {
  try {
    const supabase = createStaticClient();

    const [members, photos] = await Promise.all([
      supabase
        .from("team_members")
        .select(COLUMNS)
        .eq("is_active", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("team_members")
        .select("id,image")
        .eq("is_active", true)
        .not("image", "like", "data:%"),
    ]);

    if (members.error) {
      console.error("Error fetching team members:", members.error);
      return [];
    }

    const urls = new Map((photos.data ?? []).map((p) => [p.id, p.image as string]));

    return (members.data ?? []).map((m) => ({
      ...m,
      image:
        urls.get(m.id) ??
        `/api/team-photo/${m.id}/${encodeURIComponent(String(new Date(m.updated_at ?? 0).getTime()))}`,
    })) as TeamMember[];
  } catch (error) {
    console.error("Error in getTeamMembersServer:", error);
    return [];
  }
}
