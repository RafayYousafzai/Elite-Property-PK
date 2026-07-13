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
  Input,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { PlusIcon, TrashIcon, UserGroupIcon, EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { getAllAgents, createAgent, deleteAgent } from "./actions";
import toast from "react-hot-toast";

interface Agent {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    const result = await getAllAgents();
    if (result.success && result.data) {
      setAgents(result.data as Agent[]);
    } else {
      toast.error(result.error || "Failed to load agents");
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const result = await createAgent(formEmail, formPassword, formName);
    if (result.success) {
      toast.success("Agent created successfully!");
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      onCreateClose();
      fetchAgents();
    } else {
      toast.error(result.error || "Failed to create agent");
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const result = await deleteAgent(deleteId);
    if (result.success) {
      toast.success("Agent deleted successfully");
      fetchAgents();
    } else {
      toast.error(result.error || "Failed to delete agent");
    }
    onDeleteClose();
    setDeleteId(null);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                CRM Agents
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your real estate agents and team permissions
              </p>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            startContent={<PlusIcon className="h-5 w-5" />}
            onPress={onCreateOpen}
            className="font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20"
          >
            Create Agent
          </Button>
        </div>

        {/* Agents Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <Table
              aria-label="Agents management table"
              classNames={{
                wrapper: "shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>CREATED AT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No agents added yet. Create one to get started.">
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {agent.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 dark:text-gray-400">
                        {agent.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(agent.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => openDeleteModal(agent.id)}
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

      {/* Create Agent Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} placement="center">
        <ModalContent>
          <form onSubmit={handleCreate}>
            <ModalHeader className="flex flex-col gap-1">Create CRM Agent</ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                isRequired
                label="Full Name"
                placeholder="Enter agent name"
                value={formName}
                onValueChange={setFormName}
                startContent={<UserIcon className="h-5 w-5 text-gray-400" />}
                variant="flat"
              />
              <Input
                isRequired
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                value={formEmail}
                onValueChange={setFormEmail}
                startContent={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                variant="flat"
              />
              <Input
                isRequired
                type="password"
                label="Password"
                placeholder="Enter login password"
                value={formPassword}
                onValueChange={setFormPassword}
                startContent={<KeyIcon className="h-5 w-5 text-gray-400" />}
                variant="flat"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCreateClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={submitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Remove Agent</ModalHeader>
          <ModalBody>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Are you sure you want to remove this agent? Their credentials will be invalidated immediately, though any leads previously assigned to them will remain in the database.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete} className="font-semibold">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
