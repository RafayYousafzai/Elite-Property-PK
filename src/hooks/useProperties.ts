"use client";

import { useState, useEffect, useCallback } from "react";
import { Property } from "@/types/property";
import {
  getPropertiesClient,
  transformDatabaseProperty,
} from "@/lib/supabase/properties";
import { createClient } from "@/utils/supabase/client";

interface UsePropertiesReturn {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Holds the full listing set (seeded from the server render) and keeps it live
// via a realtime subscription. Filtering happens in memory on the caller side.
export function useProperties(initialProperties: Property[] = []): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPropertiesClient();
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
      console.error("Error fetching properties:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fall back to a client fetch only if the server render came back empty
  useEffect(() => {
    if (initialProperties.length === 0) fetchProperties();
  }, [initialProperties.length, fetchProperties]);

  useEffect(() => {
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
        () => {
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
    isLoading,
    error,
    refetch: fetchProperties,
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
