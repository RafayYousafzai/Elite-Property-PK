"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Eye } from "lucide-react";
import Image from "next/image";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  type: "home" | "apartment" | "plot";
}

export default function PropertyCard({ property, type }: PropertyCardProps) {
  const isHome = type === "home" || type === "apartment";

  return (
    <Card className="property-card-hover bg-card border-border overflow-hidden group">
      <div className="relative overflow-hidden">
        <Image
          src={
            property.images[0]?.src ||
            "/placeholder.svg?height=250&width=400&query=luxury property"
          }
          alt={property.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-background/90 text-foreground backdrop-blur-sm"
          >
            {isHome ? "Home" : "Plot"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground font-semibold">
            ${Number.parseInt(property.rate).toLocaleString()}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-card-foreground text-balance leading-tight">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {isHome && property.beds && property.baths && (
            <>
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.beds} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.baths} baths</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.area} sq ft</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="px-3 bg-transparent">
            360°
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
