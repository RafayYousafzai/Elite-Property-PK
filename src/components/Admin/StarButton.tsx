"use client";

import { useState } from "react";
import { updatePropertyFeaturedStatus } from "@/lib/supabase/properties";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface StarButtonProps {
  propertyId: string;
  isFeatured: boolean;
  onStatusChange?: (isFeatured: boolean) => void;
}

export default function StarButton({
  propertyId,
  isFeatured,
  onStatusChange,
}: StarButtonProps) {
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(isFeatured);

  const toggleFeatured = async () => {
    setLoading(true);
    try {
      const success = await updatePropertyFeaturedStatus(propertyId, !featured);
      if (success) {
        setFeatured(!featured);
        onStatusChange?.(!featured);
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFeatured}
      disabled={loading}
      className={`p-2 rounded-lg transition-all duration-200 transform ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-110 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
      } ${
        featured
          ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
          : "text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
      }`}
      title={featured ? "Remove from featured" : "Mark as featured"}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      ) : featured ? (
        <StarIconSolid className="h-5 w-5" />
      ) : (
        <StarIcon className="h-5 w-5" />
      )}
    </button>
  );
}
