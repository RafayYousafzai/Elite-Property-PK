"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import DeletePropertyButton from "@/components/Admin/DeletePropertyButton";
import StarButton from "@/components/Admin/StarButton";
import {
  PencilIcon,
  MapPinIcon,
  HomeIcon,
  StarIcon,
  PlusIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import formatNumberShort from "@/lib/formatNumberShort";
import { getImageUrl } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  location: string;
  property_type: string;
  rate: string;
  area: number;
  beds?: number;
  baths?: number;
  images?: (string | { src: string })[];
  description?: string;
  is_featured: boolean;
}

interface PropertiesListProps {
  initialProperties: Property[];
  initialCategory?: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  searchQuery: string;
}

// Property type categories mapping
const propertyTypes = {
  Home: [
    "House",
    "flat/appartment",
    "Farm House",
    "Room",
    "Upper Portion",
    "Lower Portion",
    "Penthouse",
  ],
  Plots: [
    "Residential Plot",
    "Commercial Plot",
    "Agricultural Land",
    "Industrial Land",
    "Plot File",
    "Plot Form",
  ],
  Commercial: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"],
};

export default function PropertiesList({
  initialProperties,
  initialCategory,
  currentPage,
  totalPages,
  totalCount,
  searchQuery,
}: PropertiesListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [properties, setProperties] = useState(initialProperties);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "All"
  );
  const [searchVal, setSearchVal] = useState(searchQuery || "");

  // Sync state with incoming paginated / filtered properties from server
  useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  useEffect(() => {
    setSelectedCategory(initialCategory || "All");
  }, [initialCategory]);

  useEffect(() => {
    setSearchVal(searchQuery || "");
  }, [searchQuery]);

  const updateQuery = (updates: { page?: number; category?: string; search?: string }) => {
    const params = new URLSearchParams(window.location.search);

    if (updates.page !== undefined) {
      params.set("page", updates.page.toString());
    }
    if (updates.category !== undefined) {
      if (updates.category === "All") {
        params.delete("category");
      } else {
        params.set("category", updates.category);
      }
      params.set("page", "1"); // Reset to page 1 on category change
    }
    if (updates.search !== undefined) {
      if (updates.search === "") {
        params.delete("search");
      } else {
        params.set("search", updates.search);
      }
      params.set("page", "1"); // Reset to page 1 on search change
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchVal });
  };

  const filteredProperties = properties;

  const handleFeaturedChange = (propertyId: string, isFeatured: boolean) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === propertyId
          ? { ...property, is_featured: isFeatured }
          : property
      )
    );
  };

  const handleDeleteProperty = (propertyId: string) => {
    // Remove the property from the local state immediately for instant UI update
    setProperties((prev) =>
      prev.filter((property) => property.id !== propertyId)
    );
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return <HomeIcon className="h-4 w-4" />;
      case "apartment":
        return <BuildingOfficeIcon className="h-4 w-4" />;
      default:
        return <MapPinIcon className="h-4 w-4" />;
    }
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "apartment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "plot":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <>
      {/* Filter and Search Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter by Category
            </h3>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 focus:outline-none transition duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            {searchVal && (
              <button
                type="button"
                onClick={() => {
                  setSearchVal("");
                  updateQuery({ search: "" });
                }}
                className="absolute right-20 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition duration-200"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-200"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateQuery({ category: "All" })}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => updateQuery({ category: "Home" })}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedCategory === "Home"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Homes</span>
            </button>
            <button
              onClick={() => updateQuery({ category: "Plots" })}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedCategory === "Plots"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
              }`}
            >
              <MapPinIcon className="h-4 w-4" />
              <span>Plots</span>
            </button>
            <button
              onClick={() => updateQuery({ category: "Commercial" })}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedCategory === "Commercial"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm"
              }`}
            >
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>Commercial</span>
            </button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-950 dark:text-white">{properties.length}</span> of{" "}
            <span className="font-semibold text-gray-950 dark:text-white">{totalCount}</span>{" "}
            {selectedCategory !== "All" ? selectedCategory.toLowerCase() : "properties"}
          </div>
        </div>
      </div>

      {filteredProperties && filteredProperties.length > 0 ? (
        <>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Property Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {property.images && property.images.length > 0 ? (
                      <div className="relative group">
                        <Image
                          className="h-20 w-20 lg:h-24 lg:w-24 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all duration-200"
                          src={getImageUrl(property.images?.[0])}
                          alt={property.name}
                          width={96}
                          height={96}
                          unoptimized={true}
                        />
                        {property.is_featured && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <StarIconSolid className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-20 w-20 lg:h-24 lg:w-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                        <BuildingOfficeIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {property.name}
                      </h3>
                      {property.is_featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <StarIcon className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPropertyTypeColor(
                          property.property_type
                        )}`}
                      >
                        {getPropertyTypeIcon(property.property_type)}
                        <span className="ml-1 capitalize">
                          {property.property_type}
                        </span>
                      </span>

                      <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                        {formatNumberShort(Number(property.rate) || 0)}
                      </div>

                      {property.beds && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <span className="text-sm mr-1">🛏️</span>
                          {property.beds} beds
                        </div>
                      )}

                      {property.baths && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <span className="text-sm mr-1">🚿</span>
                          {property.baths} baths
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 lg:flex-shrink-0">
                  <StarButton
                    propertyId={property.id}
                    isFeatured={property.is_featured}
                    onStatusChange={(isFeatured) =>
                      handleFeaturedChange(property.id, isFeatured)
                    }
                  />

                  <Link
                    href={`/admin/properties/edit/${property.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Link>

                  <DeletePropertyButton
                    propertyId={property.id}
                    onDelete={() => handleDeleteProperty(property.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateQuery({ page: currentPage - 1 })}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateQuery({ page: currentPage + 1 })}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> pages
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => updateQuery({ page: currentPage - 1 })}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Only show a window of pages to avoid overcrowding
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateQuery({ page: pageNum })}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-200 ${
                            pageNum === currentPage
                              ? "z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    
                    if (
                      pageNum === 2 ||
                      pageNum === totalPages - 1
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => updateQuery({ page: currentPage + 1 })}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-6">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by creating your first property. You can add photos,
            descriptions, and all the important details.
          </p>
          <Link
            href="/admin/properties/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Property
          </Link>
        </div>
      )}
    </>
  );
}
