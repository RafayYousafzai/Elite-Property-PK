"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeletePropertyButton from "@/components/Admin/DeletePropertyButton";
import StarButton from "@/components/Admin/StarButton";

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

  return (
    <>
      {properties && properties.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {properties.map((property) => (
              <li key={property.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {property.images && property.images.length > 0 && (
                        <Image
                          className="h-16 w-16 rounded-lg object-cover mr-4"
                          src={property.images[0].src}
                          alt={property.name}
                          width={64}
                          height={64}
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {property.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property.location}
                        </p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs mr-2">
                            {property.property_type}
                          </span>
                          <span className="mr-2">💰 ${property.rate}</span>
                          <span className="mr-2">📐 {property.area} sq ft</span>
                          {property.beds && (
                            <span className="mr-2">🛏️ {property.beds}</span>
                          )}
                          {property.baths && (
                            <span className="mr-2">🚿 {property.baths}</span>
                          )}
                          {property.is_featured && (
                            <span className="mr-2 text-yellow-600 font-semibold">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarButton
                        propertyId={property.id}
                        isFeatured={property.is_featured}
                        onStatusChange={(isFeatured) =>
                          handleFeaturedChange(property.id, isFeatured)
                        }
                      />
                      <Link
                        href={`/admin/properties/edit/${property.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Edit
                      </Link>
                      <DeletePropertyButton propertyId={property.id} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get started by creating your first property.
            </p>
            <Link
              href="/admin/properties/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Your First Property
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
