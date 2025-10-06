"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  getTeamMembers,
  deleteTeamMember,
  reorderTeamMembers,
} from "@/lib/supabase/team";
import { TeamMember } from "@/types/team";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTeamMemberRow } from "@/components/Admin/Team/SortableTeamMemberRow";
import DashboardLayout from "@/components/Admin/DashboardLayout";

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await getTeamMembers(true); // Include inactive
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      setDeleting(id);
      await deleteTeamMember(id);
      toast.success("Team member deleted successfully");
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setDeleting(null);
    }
  };

  const handleDragEnd = async (event: {
    active: { id: string | number };
    over: { id: string | number } | null;
  }) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = teamMembers.findIndex(
      (item) => item.id === String(active.id)
    );
    const newIndex = teamMembers.findIndex(
      (item) => item.id === String(over.id)
    );

    const newOrder = arrayMove(teamMembers, oldIndex, newIndex);
    setTeamMembers(newOrder);

    try {
      const updates = newOrder.map((member, index) => ({
        id: member.id,
        display_order: index,
      }));
      await reorderTeamMembers(updates);
      toast.success("Team members reordered successfully");
    } catch (error) {
      console.error("Error reordering team members:", error);
      toast.error("Failed to save new order");
      fetchTeamMembers(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-3 border-gray-200 dark:border-gray-700 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Team Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your team members and their information
            </p>
          </div>
          <Link
            href="/admin/team/create"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
          >
            <Icon icon="ph:plus" width={20} />
            Add Team Member
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Total Members
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {teamMembers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
                <Icon
                  icon="ph:users-three"
                  width={24}
                  className="text-amber-600"
                />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {teamMembers.filter((m) => m.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-lg flex items-center justify-center">
                <Icon
                  icon="ph:check-circle"
                  width={24}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  Inactive
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  {teamMembers.filter((m) => !m.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-950/30 rounded-lg flex items-center justify-center">
                <Icon icon="ph:x-circle" width={24} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Team Members
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Drag to reorder
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="p-12 text-center">
              <Icon
                icon="ph:users-three"
                width={64}
                height={64}
                className="text-gray-300 dark:text-gray-700 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No team members yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get started by adding your first team member
              </p>
              <Link
                href="/admin/team/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-300"
              >
                <Icon icon="ph:plus" width={20} />
                Add Team Member
              </Link>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={teamMembers.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {teamMembers.map((member) => (
                    <SortableTeamMemberRow
                      key={member.id}
                      member={member}
                      onDelete={handleDelete}
                      deleting={deleting === member.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
