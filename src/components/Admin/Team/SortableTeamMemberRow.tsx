import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/types/team";

interface SortableTeamMemberRowProps {
  member: TeamMember;
  onDelete: (id: string, name: string) => void;
  deleting: boolean;
}

export function SortableTeamMemberRow({
  member,
  onDelete,
  deleting,
}: SortableTeamMemberRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: member.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <Icon
          icon="ph:dots-six-vertical"
          width={24}
          className="text-gray-400"
        />
      </div>

      {/* Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
          {member.name}
        </h3>
        <p className="text-sm text-amber-600 dark:text-amber-500">
          {member.role}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {member.experience}
        </p>
      </div>

      {/* Status */}
      <div>
        {member.is_active ? (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-500 text-xs font-medium rounded-full">
            Active
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-950/30 text-gray-700 dark:text-gray-500 text-xs font-medium rounded-full">
            Inactive
          </span>
        )}
      </div>

      {/* Contact Info */}
      <div className="hidden lg:flex flex-col gap-1 min-w-[200px]">
        {member.email && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Icon icon="ph:envelope" width={14} />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        {member.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Icon icon="ph:phone" width={14} />
            <span>{member.phone}</span>
          </div>
        )}
        {!member.email && !member.phone && (
          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
            No contact info
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/team/edit/${member.id}`}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/30 transition-colors duration-200"
          title="Edit"
        >
          <Icon icon="ph:pencil-simple" width={18} />
        </Link>
        <button
          onClick={() => onDelete(member.id, member.name)}
          disabled={deleting}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete"
        >
          {deleting ? (
            <Icon icon="ph:spinner" width={18} className="animate-spin" />
          ) : (
            <Icon icon="ph:trash" width={18} />
          )}
        </button>
      </div>
    </div>
  );
}
