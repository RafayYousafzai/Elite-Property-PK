"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeletePropertyButton from "@/components/Admin/DeletePropertyButton";
import StarButton from "@/components/Admin/StarButton";
import {
  PencilIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  StarIcon,
  PlusIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface Property {
  id: string;
  name: string;
  location: string;
  property_type: string;
  rate: string;
  area: number;
  beds?: number;
  baths?: number;
  images?: { src: string }[];
  description?: string;
  is_featured: boolean;
}

interface PropertiesListProps {
  initialProperties: Property[];
}

export default function PropertiesList({
  initialProperties,
}: PropertiesListProps) {
  const [properties, setProperties] = useState(initialProperties);

  const handleFeaturedChange = (propertyId: string, isFeatured: boolean) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === propertyId
          ? { ...property, is_featured: isFeatured }
          : property
      )
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
      {properties && properties.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {properties.map((property, index) => (
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
                          src={property.images[0].src}
                          alt={property.name}
                          width={96}
                          height={96}
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
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {property.rate}
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <HomeIcon className="h-4 w-4 mr-1" />
                        {property.area} sq ft
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

                  <DeletePropertyButton propertyId={property.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
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
