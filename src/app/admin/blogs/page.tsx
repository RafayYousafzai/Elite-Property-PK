"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { getAllBlogs, deleteBlog, toggleBlogPublished } from "./actions";
import { format } from "date-fns";
import Image from "next/image";
import toast from "react-hot-toast";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author: string;
  author_image?: string;
  tag?: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const result = await getAllBlogs(true); // Include unpublished
    if (result.success && result.data) {
      setBlogs(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const result = await deleteBlog(deleteId);
    if (result.success) {
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } else {
      toast.error(result.error || "Failed to delete blog");
    }
    onClose();
    setDeleteId(null);
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    const result = await toggleBlogPublished(id, !currentStatus);
    if (result.success) {
      toast.success(`Blog ${!currentStatus ? "published" : "unpublished"}`);
      fetchBlogs();
    } else {
      toast.error(result.error || "Failed to update blog");
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
              <NewspaperIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Blog Management
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your blog posts and articles
              </p>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            startContent={<PlusIcon className="h-5 w-5" />}
            onPress={() => router.push("/admin/blogs/create")}
            className="font-semibold"
          >
            Create Blog Post
          </Button>
        </div>

        {/* Blogs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table
              aria-label="Blogs table"
              classNames={{
                wrapper: "shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>POST</TableColumn>
                <TableColumn>AUTHOR</TableColumn>
                <TableColumn>TAG</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>PUBLISHED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No blogs found">
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        {blog.cover_image && (
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={blog.cover_image}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="max-w-md">
                          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {blog.excerpt || "No excerpt"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {blog.author_image && (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={blog.author_image}
                              alt={blog.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm">{blog.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color="primary" variant="flat">
                        {blog.tag || "General"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={blog.is_published ? "success" : "warning"}
                        variant="flat"
                        className="cursor-pointer"
                        onClick={() =>
                          handleTogglePublished(blog.id, blog.is_published)
                        }
                      >
                        {blog.is_published ? "Published" : "Draft"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(blog.published_at), "MMM d, yyyy")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() =>
                            router.push(`/admin/blogs/edit/${blog.id}`)
                          }
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => openDeleteModal(blog.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
