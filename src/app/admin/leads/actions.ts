"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to check user auth and return profile
async function getAuthSession() {
  const supabase = await createClient(cookies());
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile } = await supabase
    .from("crm_users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function getAllLeads() {
  try {
    const session = await getAuthSession();
    if (!session || !session.profile) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const { user, profile } = session;
    const supabase = await createClient(cookies());

    let query = supabase.from("leads").select("*");

    // Agents can only see leads assigned to them
    if (profile.role === "agent") {
      query = query.eq("assigned_to", user.id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to fetch leads:", err);
    return { success: false, error: err.message || "Failed to load leads" };
  }
}

export async function deleteLead(id: string) {
  try {
    const session = await getAuthSession();
    if (!session || session.profile?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin permissions required." };
    }

    const supabase = await createClient(cookies());
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete lead:", err);
    return { success: false, error: err.message || "Failed to delete lead" };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const session = await getAuthSession();
    if (!session || !session.profile) {
      return { success: false, error: "Unauthorized." };
    }

    const { user, profile } = session;
    const supabase = await createClient(cookies());

    // Retrieve lead to check assignment and name
    const { data: lead, error: fetchErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (fetchErr || !lead) {
      return { success: false, error: "Lead not found" };
    }

    // Agents can only update their assigned leads
    if (profile.role === "agent" && lead.assigned_to !== user.id) {
      return { success: false, error: "Unauthorized. Lead is not assigned to you." };
    }

    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);

    if (error) throw error;

    // Send notifications
    if (profile.role === "agent") {
      // Notify admins
      const { data: admins } = await supabase
        .from("crm_users")
        .select("id")
        .eq("role", "admin");

      if (admins) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          title: "Lead Status Updated",
          message: `${profile.name} moved lead '${lead.full_name}' to '${status}'.`,
        }));
        await supabase.from("crm_notifications").insert(notifications);
      }
    } else if (lead.assigned_to && lead.assigned_to !== user.id) {
      // Notify the assigned agent
      await supabase.from("crm_notifications").insert({
        user_id: lead.assigned_to,
        title: "Lead Status Updated by Admin",
        message: `Admin moved lead '${lead.full_name}' to '${status}'.`,
      });
    }

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update status:", err);
    return { success: false, error: err.message };
  }
}

export async function assignLeadToAgent(leadId: string, agentId: string | null) {
  try {
    const session = await getAuthSession();
    if (!session || session.profile?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin permissions required." };
    }

    const supabase = await createClient(cookies());

    // Fetch lead details
    const { data: lead } = await supabase
      .from("leads")
      .select("full_name")
      .eq("id", leadId)
      .single();

    const { error } = await supabase
      .from("leads")
      .update({ assigned_to: agentId })
      .eq("id", leadId);

    if (error) throw error;

    // Send Notification to Agent
    if (agentId) {
      await supabase.from("crm_notifications").insert({
        user_id: agentId,
        title: "New Lead Assigned",
        message: `Lead '${lead?.full_name || "Client"}' has been assigned to you.`,
      });
    }

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to assign agent:", err);
    return { success: false, error: err.message };
  }
}

export async function getLeadNotes(leadId: string) {
  try {
    const session = await getAuthSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const supabase = await createClient(cookies());
    const { data, error } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to get notes:", err);
    return { success: false, error: err.message };
  }
}

export async function createLeadNote(leadId: string, noteText: string) {
  try {
    const session = await getAuthSession();
    if (!session || !session.profile) {
      return { success: false, error: "Unauthorized." };
    }

    const { user, profile } = session;
    const supabase = await createClient(cookies());

    // Insert Note
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: leadId,
        user_id: user.id,
        author_name: profile.name,
        note: noteText,
      })
      .select()
      .single();

    if (error) throw error;

    // Retrieve lead details
    const { data: lead } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    // Notify other party
    if (lead) {
      if (profile.role === "agent") {
        // Notify Admins
        const { data: admins } = await supabase
          .from("crm_users")
          .select("id")
          .eq("role", "admin");

        if (admins) {
          const notifications = admins.map((admin) => ({
            user_id: admin.id,
            title: "New Note Added by Agent",
            message: `${profile.name} added a note to lead '${lead.full_name}'.`,
          }));
          await supabase.from("crm_notifications").insert(notifications);
        }
      } else if (lead.assigned_to && lead.assigned_to !== user.id) {
        // Notify Agent
        await supabase.from("crm_notifications").insert({
          user_id: lead.assigned_to,
          title: "New Note Added by Admin",
          message: `Admin added a note to lead '${lead.full_name}'.`,
        });
      }
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to create note:", err);
    return { success: false, error: err.message };
  }
}
