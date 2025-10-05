"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Card,
  CardBody,
  Image,
  Spinner,
  Chip,
} from "@heroui/react";
import { Upload, X, GripVertical, Star } from "lucide-react";
import LocationAutocomplete from "../shared/LocationAutocomplete";
import FeaturesAmenitiesModal from "./features-amenities-modal";
import { CubeIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/utils/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import formatNumberShort from "@/lib/formatNumberShort";

export interface PropertyFormData {
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
  images?: (File | string)[]; // Optional - Accept both File objects and string URLs
  videoUrl: string;
  photo_sphere?: File | string | null; // Optional - Accept both File and string URL
  constructed_covered_area?: number;
  is_sold?: boolean;
  phase?: string;
  sector?: string;
  street?: string;
  featured_image_index?: number; // Index 0 = first image is the cover/featured
}

export const propertyTypes = {
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

// Sortable Image Item Component
interface SortableImageItemProps {
  id: string;
  preview: string;
  index: number;
  onRemove: (index: number) => void;
  isFeatured: boolean;
}

function SortableImageItem({
  id,
  preview,
  index,
  onRemove,
  isFeatured,
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "z-50" : ""}`}
    >
      <div className="relative">
        <Image
          src={preview || "/placeholder.svg"}
          alt={`Preview ${index + 1}`}
          className="w-full h-40 object-cover"
        />

        {/* Featured Badge */}
        {isFeatured && (
          <Chip
            color="warning"
            variant="solid"
            size="sm"
            startContent={<Star className="h-3 w-3 fill-current" />}
            className="absolute top-2 left-2 z-10"
          >
            Cover
          </Chip>
        )}

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <GripVertical className="h-4 w-4 text-white" />
        </div>

        {/* Remove Button */}
        <Button
          isIconOnly
          color="danger"
          size="sm"
          onClick={() => onRemove(index)}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (
    formData: PropertyFormData,
    uploadedImages: string[],
    photo_sphere?: string
  ) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
  error?: string;
  onCancel?: () => void;
}

export default function PropertyForm({
  initialData,
  onSubmit,
  submitLabel = "Save Property",
  loading = false,
  error = "",
  onCancel,
}: PropertyFormProps) {
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
    photo_sphere: null,
    constructed_covered_area: 0,
    is_sold: false,
    phase: "",
    sector: "",
    street: "",
    ...initialData,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [photoSpherePreview, setPhotoSpherePreview] = useState<string | null>(
    null
  );
  const [uploadingImages, setUploadingImages] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle initial data - set previews for existing images and photo_sphere
  useEffect(() => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      // Filter only string URLs (existing images from DB)
      const existingImageUrls = initialData.images.filter(
        (img): img is string => typeof img === "string"
      );
      setImagePreviews(existingImageUrls);
    }

    if (
      initialData?.photo_sphere &&
      typeof initialData.photo_sphere === "string"
    ) {
      setPhotoSpherePreview(initialData.photo_sphere);
    }
  }, [initialData]);

  // Handle drag end for image reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imagePreviews.findIndex(
        (_, i) => `image-${i}` === active.id
      );
      const newIndex = imagePreviews.findIndex(
        (_, i) => `image-${i}` === over.id
      );

      // Reorder both previews and actual images
      setImagePreviews((items) => arrayMove(items, oldIndex, newIndex));
      setFormData((prev) => ({
        ...prev,
        images: arrayMove(prev.images || [], oldIndex, newIndex),
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...files],
      }));

      // Create previews
      const previews = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      setImagePreviews((prev) => [...prev, ...previews]);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (
    images: (File | string)[]
  ): Promise<string[]> => {
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const image of images) {
      // Case 1: Already a URL (from DB / initialData)
      if (typeof image === "string") {
        uploadedUrls.push(image);
        continue;
      }

      // Case 2: New File
      if (image instanceof File) {
        const fileExt = image.name.split(".").pop() ?? "jpg";
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error } = await supabase.storage
          .from("property-images")
          .upload(filePath, image);

        if (error) {
          console.error("Error uploading image:", error);
          throw new Error(`Failed to upload image: ${image.name}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploadingImages(true);

      // Upload images to Supabase storage
      const uploadedImages = await uploadImagesToSupabase(
        formData.images || []
      );
      console.log(uploadedImages, "uploadedImages");

      // Upload photo_sphere if present
      let photo_sphereUrl: string | undefined = undefined;
      if (formData.photo_sphere) {
        // If it's already a string URL, use it directly
        if (typeof formData.photo_sphere === "string") {
          photo_sphereUrl = formData.photo_sphere;
        } else {
          // Otherwise, upload the file
          const photo_sphereUrls = await uploadImagesToSupabase([
            formData.photo_sphere,
          ]);
          photo_sphereUrl = photo_sphereUrls[0];
        }
      }
      console.log(photo_sphereUrl, "photo_sphereUrl");

      // Call parent's onSubmit with uploaded image URLs
      await onSubmit(formData, uploadedImages, photo_sphereUrl);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handlePhotoSphereUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFormData((prev) => ({
        ...prev,
        photo_sphere: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoSpherePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error loading 3D image:", error);
    }
  };

  const removePhotoSphere = () => {
    setFormData((prev) => ({
      ...prev,
      photo_sphere: null,
    }));
    setPhotoSpherePreview(null);
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {(loading || uploadingImages) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Spinner size="lg" color="primary" />
            <p className="text-lg font-semibold">
              {uploadingImages ? "Uploading images..." : "Saving property..."}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto space-y-12 p-8"
      >
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
                  <span className="text-lg font-semibold">
                    Select Purpose *
                  </span>
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
                  {(["Home", "Plots", "Commercial"] as const).map(
                    (category) => (
                      <Tab key={category} title={category}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                          {propertyTypes[category].map((type) => (
                            <Button
                              key={type}
                              variant={
                                formData.propertyType === type
                                  ? "shadow"
                                  : "flat"
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
                    )
                  )}
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
                        areaUnit: Array.from(keys)[0] as
                          | "Marla"
                          | "Sq Ft"
                          | "Sq Yd"
                          | "Kanal",
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
                  label={`Price (${formatNumberShort(formData.price)}) *`}
                  placeholder="Enter price"
                  value={formData.price}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, price: value }))
                  }
                  size="lg"
                />
                <Input
                  type="number"
                  label="Constructed Covered Area (Sqr Ft)"
                  placeholder="Constructed Covered Area  (Sqr Ft)"
                  value={String(formData.constructed_covered_area || 0)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      constructed_covered_area: Number(value),
                    }))
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
              {/* Only show bedrooms and bathrooms for Home category */}
              {formData.propertyCategory === "Home" && (
                <>
                  <div className="space-y-4">
                    <label className="text-lg font-semibold text-foreground-500">
                      Bedrooms
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {bedroomOptions.map((option) => (
                        <Button
                          key={option}
                          variant={
                            formData.bedrooms === option ? "shadow" : "flat"
                          }
                          color={
                            formData.bedrooms === option ? "primary" : "default"
                          }
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              bedrooms: option,
                            }))
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
                          variant={
                            formData.bathrooms === option ? "shadow" : "flat"
                          }
                          color={
                            formData.bathrooms === option
                              ? "primary"
                              : "default"
                          }
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              bathrooms: option,
                            }))
                          }
                          className="h-12 text-base font-medium"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Only show phase, sector, street for Plots category */}
              {formData.propertyCategory === "Plots" && (
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-foreground-500">
                    Plot Details (Optional)
                  </label>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Input
                      label="Phase"
                      placeholder="e.g. Phase 5"
                      value={formData.phase || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, phase: value }))
                      }
                      size="lg"
                    />
                    <Input
                      label="Sector"
                      placeholder="e.g. Sector A"
                      value={formData.sector || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, sector: value }))
                      }
                      size="lg"
                    />
                    <Input
                      label="Street"
                      placeholder="e.g. Street 12"
                      value={formData.street || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, street: value }))
                      }
                      size="lg"
                    />
                  </div>
                </div>
              )}

              {/* Is Sold Switch */}
              <div className="space-y-4">
                <Switch
                  isSelected={formData.is_sold || false}
                  onValueChange={(isSelected) =>
                    setFormData((prev) => ({ ...prev, is_sold: isSelected }))
                  }
                >
                  <span className="text-base font-semibold">Mark as Sold</span>
                </Switch>
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
                    type={
                      formData.propertyCategory === "Plots" ? "plot" : "default"
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
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-foreground-500">
                    Property Images
                  </label>
                  {imagePreviews.length > 0 && (
                    <p className="text-sm text-foreground-400 flex items-center gap-2">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      First image is the cover photo. Drag to reorder.
                    </p>
                  )}
                </div>
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
                    <p className="text-sm text-foreground-500">JPG or PNG</p>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={imagePreviews.map((_, i) => `image-${i}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {imagePreviews.map((preview, index) => (
                          <SortableImageItem
                            key={`image-${index}`}
                            id={`image-${index}`}
                            preview={preview}
                            index={index}
                            onRemove={removeImage}
                            isFeatured={index === 0}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-lg font-semibold text-foreground-500">
                  360° Photo Sphere (Optional)
                </label>
                <div className="bg-default-100 rounded-xl p-12 text-center hover:bg-default-200 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={handlePhotoSphereUpload}
                    className="hidden"
                    id="3d-image-upload"
                  />
                  <label htmlFor="3d-image-upload" className="cursor-pointer">
                    <CubeIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold mb-2">
                      Click to upload 360° image
                    </p>
                    <p className="text-sm text-foreground-500">JPG or JPEG</p>
                  </label>
                </div>

                {photoSpherePreview && (
                  <div className="relative group mt-4">
                    <Image
                      src={photoSpherePreview || "/placeholder.svg"}
                      alt="360° Photo Sphere Preview"
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onClick={removePhotoSphere}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
          {onCancel && (
            <Button
              type="button"
              variant="flat"
              size="lg"
              onClick={onCancel}
              disabled={loading || uploadingImages}
              className="h-14 px-12 text-base font-semibold"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            color="primary"
            size="lg"
            disabled={loading || uploadingImages}
            className="h-14 px-12 text-base font-semibold"
          >
            {loading || uploadingImages ? (
              <>
                <Spinner size="sm" color="white" className="mr-2" />
                {uploadingImages ? "Uploading..." : "Saving..."}
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
