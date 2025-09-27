"use client";

import { useState, useEffect, useCallback } from "react";
import { Property, SearchFilters } from "@/types/property";
import {
  getFilteredProperties,
  getPropertiesClient,
} from "@/lib/supabase/properties";
import { createClient } from "@/utils/supabase/client";

interface UsePropertiesReturn {
  properties: Property[];
  filteredProperties: Property[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  applyFilters: (filters: SearchFilters) => Promise<void>;
}

export function useProperties(): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPropertiesClient();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
      console.error("Error fetching properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (filters: SearchFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFilteredProperties(filters);
      setFilteredProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to filter properties"
      );
      console.error("Error filtering properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and real-time updates
  useEffect(() => {
    fetchProperties();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("properties-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
        },
        (payload) => {
          console.log("Properties changed:", payload);
          // Refetch properties when changes occur
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProperties]);

  return {
    properties,
    filteredProperties,
    isLoading,
    error,
    refetch: fetchProperties,
    applyFilters,
  };
}

// Hook for a single property
export function useProperty(slug: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createClient();
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;

        setProperty({
          id: data.id,
          name: data.name,
          slug: data.slug,
          location: data.location,
          rate: data.rate,
          area: data.area,
          beds: data.beds,
          baths: data.baths,
          photo_sphere: data.photo_sphere,
          property_type: data.property_type,
          images: data.images || [],
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch property"
        );
        console.error("Error fetching property:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  return { property, isLoading, error };
}
