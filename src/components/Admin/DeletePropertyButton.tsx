"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteProperty } from "@/app/admin/properties/actions";

interface DeletePropertyButtonProps {
  propertyId: string;
  onDelete?: () => void;
}

export default function DeletePropertyButton({
  propertyId,
  onDelete,
}: DeletePropertyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteProperty(propertyId);

      if (!result.success) {
        console.error("Error deleting property:", result.error);
        alert(result.error || "Error deleting property");
      } else {
        // Call the onDelete callback to update parent component state
        if (onDelete) {
          onDelete();
        }
        // Also refresh the router to update server-side data
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleFirstClick = () => {
    setShowConfirm(true);
    // Auto-hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirm(false);
    }, 3000);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <TrashIcon className="h-4 w-4 mr-2" />
          )}
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="inline-flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg shadow-sm transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleFirstClick}
      className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 border border-red-200 dark:border-red-800"
    >
      <TrashIcon className="h-4 w-4 mr-2" />
      Delete
    </button>
  );
}
