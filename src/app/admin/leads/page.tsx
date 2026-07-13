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
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import {
  TrashIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  QueueListIcon,
  Squares2X2Icon,
  UserIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  getAllLeads,
  deleteLead,
  updateLeadStatus,
  assignLeadToAgent,
  getLeadNotes,
  createLeadNote,
} from "./actions";
import { getAllAgents } from "../agents/actions";
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
  status: string;
  assigned_to: string | null;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface Note {
  id: string;
  created_at: string;
  author_name: string;
  note: string;
}

const STAGES = [
  "New",
  "Contacted",
  "Meeting Scheduled",
  "Proposal Sent",
  "Closed Won",
  "Closed Lost",
];

const STAGE_COLORS: Record<string, "warning" | "primary" | "secondary" | "info" | "success" | "danger"> = {
  New: "warning",
  Contacted: "primary",
  "Meeting Scheduled": "secondary",
  "Proposal Sent": "info" as any, // fallback colors
  "Closed Won": "success",
  "Closed Lost": "danger",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [profile, setProfile] = useState<{ id: string; role: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  
  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch current profile
      const authRes = await fetch("/api/auth/me");
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated) {
          setProfile(authData.user);
          
          // 2. Fetch leads
          const leadsRes = await getAllLeads();
          if (leadsRes.success && leadsRes.data) {
            setLeads(leadsRes.data as Lead[]);
          } else {
            toast.error(leadsRes.error || "Failed to load leads");
          }

          // 3. Fetch agents if admin
          if (authData.user.role === "admin") {
            const agentsRes = await getAllAgents();
            if (agentsRes.success && agentsRes.data) {
              setAgents(agentsRes.data as Agent[]);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred loading CRM data");
    } finally {
      setLoading(false);
    }
  };

  const refreshLeads = async () => {
    const res = await getAllLeads();
    if (res.success && res.data) {
      setLeads(res.data as Lead[]);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const result = await deleteLead(deleteId);
    if (result.success) {
      toast.success("Lead deleted successfully");
      refreshLeads();
    } else {
      toast.error(result.error || "Failed to delete lead");
    }
    onDeleteClose();
    setDeleteId(null);
  };

  const openDeleteModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
    onDeleteOpen();
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    
    // Optimistic UI update
    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: targetStatus } : l))
    );

    const result = await updateLeadStatus(id, targetStatus);
    if (result.success) {
      toast.success("Lead stage updated!");
      refreshLeads();
    } else {
      toast.error(result.error || "Failed to update lead stage");
      setLeads(previousLeads); // Revert
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const result = await updateLeadStatus(leadId, newStatus);
    if (result.success) {
      toast.success(`Moved lead to ${newStatus}`);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      refreshLeads();
    } else {
      toast.error(result.error || "Failed to update lead status");
    }
  };

  const handleAgentAssignment = async (leadId: string, agentId: string) => {
    const value = agentId === "none" ? null : agentId;
    const result = await assignLeadToAgent(leadId, value);
    if (result.success) {
      toast.success("Agent assigned successfully");
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, assigned_to: value });
      }
      refreshLeads();
    } else {
      toast.error(result.error || "Failed to assign agent");
    }
  };

  const openDetailsModal = async (lead: Lead) => {
    setSelectedLead(lead);
    onDetailsOpen();
    setNotes([]);
    
    const notesRes = await getLeadNotes(lead.id);
    if (notesRes.success && notesRes.data) {
      setNotes(notesRes.data as Note[]);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;

    setSavingNote(true);
    const result = await createLeadNote(selectedLead.id, newNote);
    if (result.success && result.data) {
      setNotes((prev) => [...prev, result.data as Note]);
      setNewNote("");
      toast.success("Note added");
    } else {
      toast.error(result.error || "Failed to save note");
    }
    setSavingNote(false);
  };

  const isAdmin = profile?.role === "admin";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <EnvelopeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Leads CRM
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Track client inquiries, assign agents, and monitor pipeline stages
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <Button
                isIconOnly
                size="sm"
                variant={viewMode === "kanban" ? "solid" : "light"}
                color={viewMode === "kanban" ? "warning" : "default"}
                onPress={() => setViewMode("kanban")}
                className="rounded-lg font-semibold"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant={viewMode === "list" ? "solid" : "light"}
                color={viewMode === "list" ? "warning" : "default"}
                onPress={() => setViewMode("list")}
                className="rounded-lg font-semibold"
              >
                <QueueListIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="flat"
              color="warning"
              size="lg"
              startContent={<ArrowPathIcon className="h-5 w-5" />}
              onPress={fetchInitialData}
              className="font-semibold rounded-xl"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* CRM Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="warning" />
          </div>
        ) : viewMode === "kanban" ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageLeads = leads.filter((l) => l.status === stage);
              return (
                <div
                  key={stage}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800 min-w-[220px] flex flex-col min-h-[500px] transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-900/80"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-${STAGE_COLORS[stage] || "default"}`} />
                      {stage}
                    </h3>
                    <Chip size="sm" variant="flat" color={STAGE_COLORS[stage] || "default"}>
                      {stageLeads.length}
                    </Chip>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {stageLeads.map((lead) => {
                      const assignedAgent = agents.find((a) => a.id === lead.assigned_to);
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onClick={() => openDetailsModal(lead)}
                          className="bg-white dark:bg-gray-850 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md hover:border-amber-500/30 transition-all transform hover:-translate-y-0.5"
                        >
                          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {lead.full_name}
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-500 font-semibold mt-1">
                            {lead.budget_range}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            <Chip size="sm" variant="flat" className="text-[10px] capitalize">
                              {lead.looking_for}
                            </Chip>
                            <Chip size="sm" variant="flat" className="text-[10px] capitalize">
                              {lead.purpose}
                            </Chip>
                          </div>

                          {/* Agent Assignment Info */}
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserIcon className="h-3 w-3" />
                              {assignedAgent ? assignedAgent.name : "Unassigned"}
                            </span>
                            {isAdmin && (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                className="h-5 w-5 min-w-5 p-0"
                                onPress={(e) => openDeleteModal(lead.id, e)}
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {stageLeads.length === 0 && (
                      <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-xl py-8 text-center text-xs text-gray-400">
                        Drag leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View (Table) */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <Table
              aria-label="Campaign leads list table"
              classNames={{
                wrapper: "shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>BUDGET</TableColumn>
                <TableColumn>LOOKING FOR</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ASSIGNED AGENT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No leads received yet.">
                {leads.map((lead) => {
                  const assignedAgent = agents.find((a) => a.id === lead.assigned_to);
                  return (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      onClick={() => openDetailsModal(lead)}
                    >
                      <TableCell>
                        <span className="text-xs text-gray-500">
                          {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">
                            {lead.full_name}
                          </p>
                          <a
                            href={`tel:${lead.phone_number}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-medium text-amber-600 hover:underline"
                          >
                            {lead.phone_number}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="warning" className="font-semibold">
                          {lead.budget_range}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs capitalize bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg">
                          {lead.looking_for} ({lead.purpose})
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={STAGE_COLORS[lead.status] || "default"}
                          className="font-semibold"
                        >
                          {lead.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.assigned_to || "none"}
                              onChange={(e) => handleAgentAssignment(lead.id, e.target.value)}
                              className="text-xs rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 px-2 text-gray-700 dark:text-gray-300"
                            >
                              <option value="none">Assign Agent...</option>
                              {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {assignedAgent ? assignedAgent.name : "Unassigned"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="flat"
                            color="warning"
                            onPress={() => openDetailsModal(lead)}
                            className="font-semibold"
                          >
                            Open Details
                          </Button>
                          {isAdmin && (
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="light"
                              onPress={(e) => openDeleteModal(lead.id, e)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Details & Notes Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        size="2xl"
        scrollBehavior="inside"
        placement="center"
      >
        <ModalContent>
          {selectedLead && (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedLead.full_name}</h2>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={STAGE_COLORS[selectedLead.status] || "default"}
                    className="font-bold uppercase tracking-wider"
                  >
                    {selectedLead.status}
                  </Chip>
                </div>
                <p className="text-xs text-gray-500 font-normal">
                  Submitted: {format(new Date(selectedLead.created_at), "MMMM d, yyyy h:mm a")}
                </p>
              </ModalHeader>
              
              <ModalBody className="py-6 space-y-6">
                {/* Lead Info Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide block">Phone</span>
                    <a
                      href={`tel:${selectedLead.phone_number}`}
                      className="text-sm font-semibold text-amber-600 hover:underline"
                    >
                      {selectedLead.phone_number}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide block">Budget</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedLead.budget_range}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide block">Looking For</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {selectedLead.looking_for}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide block">Purpose</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {selectedLead.purpose}
                    </span>
                  </div>
                </div>

                {/* Status and Agent Modifiers (Side-by-side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                      Lead Stage Status
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                      className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 p-2.5 text-gray-700 dark:text-gray-300 shadow-sm"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isAdmin && (
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        Assigned CRM Agent
                      </label>
                      <select
                        value={selectedLead.assigned_to || "none"}
                        onChange={(e) => handleAgentAssignment(selectedLead.id, e.target.value)}
                        className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 p-2.5 text-gray-700 dark:text-gray-300 shadow-sm"
                      >
                        <option value="none">Unassigned</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Notes log section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-500" />
                    <h3 className="font-bold text-sm">Action Notes Log</h3>
                  </div>

                  {/* Notes Timeline */}
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-50 dark:bg-gray-900/30 p-3.5 rounded-xl border border-gray-150/40 dark:border-gray-800/80 space-y-1 animate-in fade-in duration-200"
                        >
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                              <UserIcon className="h-3 w-3" />
                              {note.author_name}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              {format(new Date(note.created_at), "MMM d, yyyy h:mm a")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            {note.note}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-xs text-gray-400">
                        No internal logs or notes written yet.
                      </p>
                    )}
                  </div>

                  {/* Write Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-3 pt-2">
                    <Textarea
                      isRequired
                      placeholder="Write an action note or follow-up update..."
                      value={newNote}
                      onValueChange={setNewNote}
                      variant="flat"
                      rows={2}
                      className="w-full"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        color="warning"
                        size="sm"
                        isLoading={savingNote}
                        className="font-semibold text-white px-5 rounded-lg"
                      >
                        Add Log Note
                      </Button>
                    </div>
                  </form>
                </div>
              </ModalBody>
              
              <ModalFooter className="border-t border-gray-100 dark:border-gray-800">
                <Button variant="light" onPress={onDetailsClose}>
                  Close CRM Details
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Delete Client Lead</ModalHeader>
          <ModalBody>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Are you sure you want to permanently delete this lead record? This action will remove all notes logs and cannot be undone.
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
