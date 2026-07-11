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
import { TrashIcon, EnvelopeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { getAllLeads, deleteLead } from "./actions";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  phone_number: string;
  budget_range: string;
  purpose: string;
  looking_for: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const result = await getAllLeads();
    if (result.success && result.data) {
      setLeads(result.data as Lead[]);
    } else {
      toast.error(result.error || "Failed to load leads. Table may not be created in Supabase yet.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const result = await deleteLead(deleteId);
    if (result.success) {
      toast.success("Lead deleted successfully");
      fetchLeads();
    } else {
      toast.error(result.error || "Failed to delete lead");
    }
    onClose();
    setDeleteId(null);
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Ad Campaign Leads
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                View and manage call back requests from ad campaigns
              </p>
            </div>
          </div>
          <Button
            variant="flat"
            color="warning"
            size="lg"
            startContent={<ArrowPathIcon className="h-5 w-5" />}
            onPress={fetchLeads}
            className="font-semibold"
          >
            Refresh
          </Button>
        </div>

        {/* Leads Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" color="warning" />
            </div>
          ) : (
            <Table
              aria-label="Campaign leads table"
              classNames={{
                wrapper: "shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>PHONE</TableColumn>
                <TableColumn>BUDGET</TableColumn>
                <TableColumn>PURPOSE</TableColumn>
                <TableColumn>LOOKING FOR</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No leads received yet. Setup your campaign page at /request-callback.">
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {lead.full_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`tel:${lead.phone_number}`}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-500"
                      >
                        {lead.phone_number}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color="warning" className="font-semibold">
                        {lead.budget_range}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lead.purpose}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color="default" className="font-semibold capitalize">
                        {lead.looking_for}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => openDeleteModal(lead.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
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
              Are you sure you want to delete this lead? This action cannot
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
