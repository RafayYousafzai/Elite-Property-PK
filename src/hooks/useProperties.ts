"use client";

import { useState, useEffect, useCallback } from "react";
import { Property, SearchFilters } from "@/types/property";
import {
  getFilteredProperties,
  getPropertiesClient,
  transformDatabaseProperty,
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

export function useProperties(initialProperties: Property[] = []): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(initialProperties.length === 0);
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

  // Real-time updates subscription only (no initial fetch here because search page immediately applies filters on mount)
  useEffect(() => {
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

        setProperty(transformDatabaseProperty(data));
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
