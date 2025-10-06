"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { TeamMemberFormData } from "@/types/team";

interface TeamMemberFormProps {
  initialData: TeamMemberFormData;
  onSubmit: (data: TeamMemberFormData) => Promise<void>;
  saving: boolean;
  submitLabel: string;
}

export function TeamMemberForm({
  initialData,
  onSubmit,
  saving,
  submitLabel,
}: TeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMemberFormData>(initialData);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to storage here
      // For now, we'll use a local object URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecialty = () => {
    if (
      specialtyInput.trim() &&
      !formData.specialties.includes(specialtyInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()],
      }));
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }
    if (!formData.role.trim()) {
      alert("Please enter a role");
      return;
    }
    if (!formData.bio.trim()) {
      alert("Please enter a bio");
      return;
    }
    if (!formData.experience.trim()) {
      alert("Please enter experience");
      return;
    }
    if (!formData.image) {
      alert("Please upload an image");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Profile Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon icon="ph:user" width={48} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Icon icon="ph:upload" width={20} />
                Upload Image
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Recommended: 400x400px, JPG or PNG
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
              placeholder="Senior Property Consultant"
            />
          </div>

          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
              placeholder="10+ Years"
            />
          </div>

          <div>
            <label
              htmlFor="display_order"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Display Order
            </label>
            <input
              type="number"
              id="display_order"
              name="display_order"
              value={formData.display_order}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white resize-none"
            placeholder="Brief description about the team member..."
          />
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Information{" "}
            <span className="text-sm font-normal text-gray-500">
              (Optional)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                placeholder="john@eliteproperty.pk"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                placeholder="+92 300 1234567"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Social Media{" "}
            <span className="text-sm font-normal text-gray-500">
              (Optional)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                <Icon
                  icon="ph:linkedin-logo"
                  width={16}
                  className="inline mr-1"
                />
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                <Icon
                  icon="ph:twitter-logo"
                  width={16}
                  className="inline mr-1"
                />
                Twitter URL
              </label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                <Icon
                  icon="ph:facebook-logo"
                  width={16}
                  className="inline mr-1"
                />
                Facebook URL
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                placeholder="https://facebook.com/username"
              />
            </div>

            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                <Icon
                  icon="ph:instagram-logo"
                  width={16}
                  className="inline mr-1"
                />
                Instagram URL
              </label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Specialties
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSpecialty())
              }
              className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 text-gray-900 dark:text-white"
              placeholder="Add a specialty..."
            />
            <button
              type="button"
              onClick={addSpecialty}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Icon icon="ph:plus" width={20} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => removeSpecialty(specialty)}
                  className="hover:text-amber-900 dark:hover:text-amber-300"
                >
                  <Icon icon="ph:x" width={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        {/* <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleCheckboxChange}
            className="w-5 h-5 text-amber-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            Active (Display on public team page)
          </label>
        </div> */}

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Icon icon="ph:spinner" width={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="ph:check" width={20} />
                {submitLabel}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={saving}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
