"use client";

import type React from "react";
import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Switch,
  Chip,
  Card,
  CardBody,
  Image,
} from "@heroui/react";
import { Upload, X, Plus } from "lucide-react";
import LocationAutocomplete from "../shared/LocationAutocomplete";
import FeaturesAmenitiesModal from "./features-amenities-modal";

interface PropertyFormData {
  purpose: "Sell" | "Rent";
  propertyType: string;
  propertyCategory: "Home" | "Plots" | "Commercial";
  city: string;
  location: string;
  areaSize: number;
  areaUnit: "Marla" | "Sq Ft" | "Sq Yd" | "Kanal";
  price: string;
  installmentAvailable: boolean;
  advanceAmount?: number;
  noOfInstallments?: number;
  monthlyInstallments?: number;
  bedrooms?: string;
  bathrooms?: string;
  amenities: Record<string, string | number | boolean>;
  title: string;
  description: string;
  images: File[];
  videoUrl: string;
}

const propertyTypes = {
  Home: [
    "House",
    "Flat",
    "Upper Portion",
    "Lower Portion",
    "Farm House",
    "Room",
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

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
];
const locations = [
  "DHA Phase 5",
  "Bahria Town",
  "Gulberg",
  "Model Town",
  "Clifton",
  "F-7",
  "G-11",
];
const bedroomOptions = [
  "Studio",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "10+",
];
const bathroomOptions = ["1", "2", "3", "4", "5", "6", "6+"];
const commonAmenities = [
  "Parking",
  "Electricity Backup",
  "Waste Disposal",
  "Elevator",
  "Security Staff",
  "CCTV Security",
  "Lawn",
  "Garden",
  "Swimming Pool",
  "Gym",
];

export default function PropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>({
    purpose: "Sell",
    propertyType: "",
    propertyCategory: "Home",
    city: "",
    location: "",
    areaSize: 0,
    areaUnit: "Marla",
    price: "",
    installmentAvailable: false,
    amenities: {},
    title: "",
    description: "",
    images: [],
    videoUrl: "",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-12 p-8">
      {/* Location and Purpose Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Location & Purpose</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <Card className="p-4">
          <CardBody className="space-y-8">
            <RadioGroup
              label={
                <span className="text-lg font-semibold">Select Purpose *</span>
              }
              orientation="horizontal"
              value={formData.purpose}
              onValueChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  purpose: value as "Sell" | "Rent",
                }))
              }
              className="gap-6"
            >
              <Radio
                value="Sell"
                classNames={{ label: "text-base font-medium" }}
              >
                Sell
              </Radio>
              <Radio
                value="Rent"
                classNames={{ label: "text-base font-medium" }}
              >
                Rent
              </Radio>
            </RadioGroup>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-foreground-500">
                Select Property Type *
              </label>
              <Tabs
                aria-label="Property Types"
                fullWidth
                size="lg"
                selectedKey={formData.propertyCategory}
                onSelectionChange={(key) =>
                  setFormData((prev) => ({
                    ...prev,
                    propertyCategory: key as "Home" | "Plots" | "Commercial",
                    propertyType: "",
                  }))
                }
              >
                {(["Home", "Plots", "Commercial"] as const).map((category) => (
                  <Tab key={category} title={category}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      {propertyTypes[category].map((type) => (
                        <Button
                          key={type}
                          variant={
                            formData.propertyType === type ? "shadow" : "flat"
                          }
                          color={
                            formData.propertyType === type
                              ? "primary"
                              : "default"
                          }
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              propertyType: type,
                            }))
                          }
                          className="h-14 text-base font-medium"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                label="City *"
                placeholder="Select city"
                selectedKeys={formData.city ? [formData.city] : []}
                onSelectionChange={(keys) =>
                  setFormData((prev) => ({
                    ...prev,
                    city: Array.from(keys)[0] as string,
                  }))
                }
                size="lg"
              >
                {cities.map((city) => (
                  <SelectItem key={city}>{city}</SelectItem>
                ))}
              </Select>

              <LocationAutocomplete
                value={formData.location}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
                className=""
                placeholder="Enter property location"
                required
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Price and Area Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Price & Area</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <Card className="p-4">
          <CardBody className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3 items-end">
                <Input
                  type="number"
                  label="Area Size *"
                  placeholder="Enter area"
                  value={String(formData.areaSize || "")}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      areaSize: Number(value),
                    }))
                  }
                  size="lg"
                />
                <Select
                  aria-label="Area Unit"
                  selectedKeys={[formData.areaUnit]}
                  onSelectionChange={(keys) =>
                    setFormData((prev) => ({
                      ...prev,
                      areaUnit: Array.from(keys)[0] as any,
                    }))
                  }
                  size="lg"
                  label="Type"
                  className="w-48"
                >
                  <SelectItem key="Marla">Marla</SelectItem>
                  <SelectItem key="Sq Ft">Sq Ft</SelectItem>
                  <SelectItem key="Sq Yd">Sq Yd</SelectItem>
                  <SelectItem key="Kanal">Kanal</SelectItem>
                </Select>
              </div>
              <Input
                type="text"
                label="Price (PKR) *"
                placeholder="Enter price"
                value={formData.price}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, price: value }))
                }
                size="lg"
              />
            </div>

            <div className="space-y-6">
              <Switch
                isSelected={formData.installmentAvailable}
                onValueChange={(isSelected) =>
                  setFormData((prev) => ({
                    ...prev,
                    installmentAvailable: isSelected,
                  }))
                }
              >
                <span className="text-base font-semibold">
                  Installment Available
                </span>
              </Switch>

              {formData.installmentAvailable && (
                <div className="grid md:grid-cols-3 gap-6 pl-6 border-l-4 border-primary/50">
                  <Input
                    type="number"
                    label="Advance Amount"
                    placeholder="0"
                    value={String(formData.advanceAmount || "")}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        advanceAmount: Number(value),
                      }))
                    }
                    size="lg"
                  />
                  <Input
                    type="number"
                    label="No of Installments"
                    placeholder="0"
                    value={String(formData.noOfInstallments || "")}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        noOfInstallments: Number(value),
                      }))
                    }
                    size="lg"
                  />
                  <Input
                    type="number"
                    label="Monthly Installments"
                    placeholder="0"
                    value={String(formData.monthlyInstallments || "")}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        monthlyInstallments: Number(value),
                      }))
                    }
                    size="lg"
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Features and Amenities Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Features & Amenities</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>
        <Card className="p-4">
          <CardBody className="space-y-8">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-foreground-500">
                Bedrooms
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {bedroomOptions.map((option) => (
                  <Button
                    key={option}
                    variant={formData.bedrooms === option ? "shadow" : "flat"}
                    color={formData.bedrooms === option ? "primary" : "default"}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bedrooms: option }))
                    }
                    className="h-12 text-base font-medium"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-lg font-semibold text-foreground-500">
                Bathrooms
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {bathroomOptions.map((option) => (
                  <Button
                    key={option}
                    variant={formData.bathrooms === option ? "shadow" : "flat"}
                    color={
                      formData.bathrooms === option ? "primary" : "default"
                    }
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, bathrooms: option }))
                    }
                    className="h-12 text-base font-medium"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4 flex justify-between">
              <label className="text-lg font-semibold text-foreground-500">
                Amenities
              </label>
              <div className="flex gap-3">
                <FeaturesAmenitiesModal
                  onSave={(values) =>
                    setFormData((prev) => ({ ...prev, amenities: values }))
                  }
                  selectedAmenities={formData.amenities}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Ad Information Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Ad Information</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>
        <Card className="p-4">
          <CardBody className="space-y-6">
            <Input
              label="Property Title *"
              placeholder="e.g. Beautiful 3 Bedroom House in DHA Phase 5"
              value={formData.title}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, title: value }))
              }
              size="lg"
            />
            <Textarea
              label="Description"
              placeholder="Describe your property, its features, and the surrounding area..."
              value={formData.description}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              minRows={6}
              size="lg"
            />
          </CardBody>
        </Card>
      </div>

      {/* Property Images and Videos Section */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Images & Videos</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <Card className="p-4">
          <CardBody className="space-y-8">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-foreground-500">
                Property Images
              </label>
              <div className="bg-default-100 rounded-xl p-12 text-center hover:bg-default-200 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".jpg,.png"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-semibold mb-2">
                    Click to upload images
                  </p>
                  <p className="text-sm text-foreground-500">
                    JPG or PNG (Max 5MB each)
                  </p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              type="url"
              label="Video URL (Optional)"
              placeholder="Paste YouTube video link"
              value={formData.videoUrl}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, videoUrl: value }))
              }
              size="lg"
            />
          </CardBody>
        </Card>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-8">
        <Button variant="flat" size="lg" className="h-14 px-8 text-base">
          Save as Draft
        </Button>
        <Button
          type="submit"
          color="primary"
          size="lg"
          className="h-14 px-12 text-base font-semibold"
        >
          Submit Property
        </Button>
      </div>
    </form>
  );
}
