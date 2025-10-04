"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { deleteTestimonial, toggleTestimonialStatus } from "./actions";
import { Avatar, Button, Card, CardBody, Spinner, Switch } from "@heroui/react";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  review: string;
  image: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching testimonials:", error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    setDeleting(id);
    const result = await deleteTestimonial(id);

    if (result.success) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } else {
      alert(`Error: ${result.error}`);
    }
    setDeleting(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleTestimonialStatus(id, !currentStatus);

    if (result.success) {
      setTestimonials(
        testimonials.map((t) =>
          t.id === id ? { ...t, is_active: !currentStatus } : t
        )
      );
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Testimonials
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage customer reviews and testimonials
              </p>
            </div>
          </div>

          <Link href="/admin/testimonials/create">
            <Button
              color="primary"
              size="lg"
              startContent={<PlusIcon className="h-5 w-5" />}
              className="font-semibold"
            >
              Add Testimonial
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Testimonials
              </p>
              <p className="text-3xl font-bold mt-2">{testimonials.length}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {testimonials.filter((t) => t.is_active).length}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Inactive
              </p>
              <p className="text-3xl font-bold mt-2 text-gray-400">
                {testimonials.filter((t) => !t.is_active).length}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {testimonials.length === 0 ? (
            <Card>
              <CardBody className="p-12 text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  No testimonials yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start by adding your first customer testimonial
                </p>
                <Link href="/admin/testimonials/create">
                  <Button color="primary">Add Testimonial</Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className={`${
                  !testimonial.is_active ? "opacity-60" : ""
                } hover:shadow-lg transition-all`}
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar
                      src={testimonial.image}
                      size="lg"
                      className="flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.position}
                          </p>
                          <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">
                            {testimonial.review}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            isSelected={testimonial.is_active}
                            onValueChange={() =>
                              handleToggleStatus(
                                testimonial.id,
                                testimonial.is_active
                              )
                            }
                            size="sm"
                            color="success"
                          />
                          <Link
                            href={`/admin/testimonials/edit/${testimonial.id}`}
                          >
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-blue-600"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Button>
                          </Link>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDelete(testimonial.id)}
                            isLoading={deleting === testimonial.id}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>Order: {testimonial.display_order}</span>
                        <span>•</span>
                        <span>
                          Added:{" "}
                          {new Date(
                            testimonial.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
