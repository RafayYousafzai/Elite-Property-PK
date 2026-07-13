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
  MagnifyingGlassIcon,
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
  "Won",
  "Lost",
];

const STAGE_COLORS: Record<string, "warning" | "primary" | "success" | "danger"> = {
  New: "warning",
  Contacted: "primary",
  Won: "success",
  Lost: "danger",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [profile, setProfile] = useState<{ id: string; role: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  
  // Real-time Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPreset, setFilterPreset] = useState<"all" | "my" | "unassigned">("all");

  // Local storage priority stars
  const [starredLeads, setStarredLeads] = useState<Record<string, boolean>>({});

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
    try {
      const stored = localStorage.getItem("crm_starred_leads");
      if (stored) setStarredLeads(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleStar = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...starredLeads, [leadId]: !starredLeads[leadId] };
    setStarredLeads(updated);
    localStorage.setItem("crm_starred_leads", JSON.stringify(updated));
    toast.success(updated[leadId] ? "Lead prioritized" : "Priority removed");
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const authRes = await fetch("/api/auth/me");
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated) {
          setProfile(authData.user);
          
          const leadsRes = await getAllLeads();
          if (leadsRes.success && leadsRes.data) {
            setLeads(leadsRes.data as Lead[]);
          } else {
            toast.error(leadsRes.error || "Failed to load leads");
          }

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

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    
    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: targetStatus } : l))
    );

    const result = await updateLeadStatus(id, targetStatus);
    if (result.success) {
      toast.success(`Moved to ${targetStatus}`);
      refreshLeads();
    } else {
      toast.error(result.error || "Failed to update stage");
      setLeads(previousLeads);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const result = await updateLeadStatus(leadId, newStatus);
    if (result.success) {
      toast.success(`Moved to ${newStatus}`);
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
      toast.success("Note logged");
    } else {
      toast.error(result.error || "Failed to save note");
    }
    setSavingNote(false);
  };

  const isAdmin = profile?.role === "admin";

  const filteredLeads = leads.filter((lead) => {
    const searchMatch =
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone_number.includes(searchQuery) ||
      lead.looking_for.toLowerCase().includes(searchQuery.toLowerCase());

    if (!searchMatch) return false;

    if (filterPreset === "my") {
      return lead.assigned_to === profile?.id;
    }
    if (filterPreset === "unassigned") {
      return !lead.assigned_to;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto px-4 py-2">
        
        {/* Minimal Header Toolbar matches mockup exactly */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-sans tracking-tight">Leads CRM</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-zinc-400" />
              </span>
              <input
                type="text"
                placeholder="Search leads, phones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-250 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder-zinc-450 font-medium shadow-xs"
              />
            </div>

            {/* Pill Filters */}
            <div className="flex bg-zinc-200/60 dark:bg-zinc-800/80 p-1 rounded-xl">
              {([
                { key: "all", label: "All" },
                { key: "my", label: "My Leads" },
                { key: "unassigned", label: "Unassigned" }
              ] as const).map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => setFilterPreset(preset.key)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filterPreset === preset.key
                      ? "bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                      : "text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* View Mode & Refresh */}
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-200/60 dark:bg-zinc-800/80 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "kanban"
                      ? "bg-white dark:bg-zinc-750 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-zinc-750 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/50"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <QueueListIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={fetchInitialData}
                className="p-2.5 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-650 dark:text-zinc-300 border border-zinc-250 dark:border-zinc-700 rounded-xl shadow-xs transition"
              >
                <ArrowPathIcon className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CRM Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="lg" color="warning" />
          </div>
        ) : viewMode === "kanban" ? (
          
          /* Kanban Board View - Scrollable columns */
          <div className="flex overflow-x-auto gap-5 pb-6 snap-x snap-mandatory scrollbar-none select-none outline-none">
            {STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.status === stage);
              
              const stageColorClass = 
                stage === "New" ? "bg-amber-500" :
                stage === "Contacted" ? "bg-sky-500" :
                stage === "Won" ? "bg-emerald-500" :
                "bg-zinc-400";

              return (
                <div
                  key={stage}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="bg-[#f4f6f8] dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800/80 w-[290px] sm:w-[320px] shrink-0 snap-start flex flex-col h-fit"
                >
                  {/* Column Title */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stageColorClass}`} />
                      <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-200 tracking-tight">
                        {stage}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards Feed */}
                  <div className="space-y-3 flex-1">
                    {stageLeads.map((lead) => {
                      const assignedAgent = agents.find((a) => a.id === lead.assigned_to);
                      const isStarred = starredLeads[lead.id] || false;
                      const agentInitials = assignedAgent ? assignedAgent.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onClick={() => openDetailsModal(lead)}
                          className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-xs border border-zinc-200 dark:border-zinc-800/60 cursor-grab active:cursor-grabbing hover:shadow-sm hover:border-zinc-350 transition-all flex flex-col gap-3 relative overflow-hidden group"
                        >
                          {/* Card Title & Star */}
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-bold text-[13px] text-zinc-900 dark:text-white leading-tight">
                              {lead.full_name}
                            </p>
                            <button
                              onClick={(e) => toggleStar(lead.id, e)}
                              className="text-zinc-300 hover:text-yellow-450 transition"
                            >
                              <span className={`text-sm leading-none ${isStarred ? "text-yellow-455" : ""}`}>
                                ★
                              </span>
                            </button>
                          </div>

                          {/* Budget Tag Row */}
                          <div className="space-y-2">
                            <div className="text-[11px] text-zinc-500 font-bold flex items-center gap-1.5">
                              <span>Budget</span>
                              <span className="inline-flex text-[10px] font-extrabold text-white bg-[#f97316] px-2 py-0.5 rounded-md">
                                {lead.budget_range}
                              </span>
                            </div>
                            
                            {/* Option tags */}
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] text-zinc-650 bg-zinc-200/60 px-1.5 py-0.5 rounded font-extrabold tracking-wide uppercase">
                                {lead.looking_for}
                              </span>
                              <span className="text-[9px] text-zinc-650 bg-zinc-200/60 px-1.5 py-0.5 rounded font-extrabold tracking-wide uppercase">
                                {lead.purpose}
                              </span>
                            </div>
                          </div>

                          {/* Footer User initial avatar & Assigned Agent name */}
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 text-[10px] text-zinc-500 font-bold">
                            <div
                              title={assignedAgent ? `Assigned to: ${assignedAgent.name}` : "Unassigned"}
                              className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                assignedAgent 
                                  ? "bg-zinc-600 text-white" 
                                  : "bg-zinc-150 dark:bg-zinc-850 text-zinc-500 border border-dashed border-zinc-300 dark:border-zinc-700"
                              }`}
                            >
                              {agentInitials}
                            </div>
                            <span className="text-[10px] text-zinc-650 font-bold truncate max-w-[150px]">
                              {assignedAgent ? `Agent: ${assignedAgent.name}` : "Unassigned"}
                            </span>
                          </div>

                          {/* Three Buttons Side-by-Side */}
                          <div className="flex gap-2 items-center">
                            <a
                              href={`tel:${lead.phone_number}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-[11px] font-extrabold shadow-xs transition"
                            >
                              Call Client
                            </a>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailsModal(lead);
                              }}
                              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-[11px] font-extrabold shadow-xs transition"
                            >
                              Assign
                            </button>

                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(lead.id);
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-650 rounded-lg transition"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}

                    {stageLeads.length === 0 && (
                      <div className="border border-dashed border-zinc-300 dark:border-zinc-800/60 rounded-xl py-12 text-center text-xs text-zinc-400 select-none bg-white/40">
                        Drop lead card here
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          
          /* Polished List View Table */
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xs overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <Table
              aria-label="Campaign leads list table"
              classNames={{
                wrapper: "shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>CLIENT NAME</TableColumn>
                <TableColumn>BUDGET</TableColumn>
                <TableColumn>LOOKING FOR</TableColumn>
                <TableColumn>STATUS STAGE</TableColumn>
                <TableColumn>ASSIGNED AGENT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No leads match your active filters.">
                {filteredLeads.map((lead) => {
                  const assignedAgent = agents.find((a) => a.id === lead.assigned_to);
                  return (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition"
                      onClick={() => openDetailsModal(lead)}
                    >
                      <TableCell>
                        <span className="text-xs text-zinc-500 font-bold">
                          {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-white">
                            {lead.full_name}
                          </p>
                          <a
                            href={`tel:${lead.phone_number}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            {lead.phone_number}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-extrabold text-white bg-[#f97316] px-2.5 py-1 rounded-lg">
                          {lead.budget_range}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold bg-zinc-150 dark:bg-zinc-800 px-2.5 py-1 rounded-lg capitalize text-zinc-650 dark:text-zinc-300">
                          {lead.looking_for} ({lead.purpose})
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={STAGE_COLORS[lead.status] || "default"}
                          className="font-bold uppercase tracking-wider text-xs"
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
                              className="text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 py-1.5 px-2 text-zinc-700 dark:text-zinc-305 shadow-xs focus:outline-none"
                            >
                              <option value="none">Unassigned</option>
                              {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-700 dark:text-zinc-300 font-extrabold">
                            {assignedAgent ? assignedAgent.name : "Unassigned"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openDetailsModal(lead)}
                            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-xs transition"
                          >
                            Details & Logs
                          </button>
                          {isAdmin && (
                            <button
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-955/20 text-red-550 rounded-lg transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(lead.id);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
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
      </div>      {/* Pure Tailwind CSS Custom Modal Overlay */}
      {isDetailsOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl h-auto flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Custom Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900">
              <div>
                <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white flex items-center gap-1.5">
                  {selectedLead.full_name}
                  {starredLeads[selectedLead.id] && (
                    <span className="text-yellow-450 text-sm">★</span>
                  )}
                </h2>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                  Received: {format(new Date(selectedLead.created_at), "MMMM d, yyyy h:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-zinc-650 bg-zinc-150 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-300/40">
                  ID: #{selectedLead.id.slice(0, 8)}
                </span>
                <button
                  onClick={onDetailsClose}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-250 text-base font-bold p-1 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Split Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
              
              {/* Left Column - Core Info */}
              <div className="col-span-1 md:col-span-7 p-6 space-y-5">
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-2">
                    Pipeline Progress
                  </span>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 dark:bg-zinc-955 rounded-xl border border-zinc-200 dark:border-zinc-800/60 shadow-inner">
                    {STAGES.map((stage) => {
                      const isActive = selectedLead.status === stage;
                      return (
                        <button
                          key={stage}
                          onClick={() => handleStatusChange(selectedLead.id, stage)}
                          className={`py-1.5 text-xs font-extrabold rounded-lg transition-all text-center ${
                            isActive
                              ? "bg-amber-505 text-white shadow-xs bg-amber-500"
                              : "text-zinc-600 dark:text-zinc-405 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">
                    Lead Details
                  </span>
                  <div className="grid grid-cols-2 gap-4 bg-[#f8f9fa] dark:bg-zinc-955/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-wide block">Phone contact</span>
                      <a
                        href={`tel:${selectedLead.phone_number}`}
                        className="text-xs font-extrabold text-[#f97316] hover:underline"
                      >
                        {selectedLead.phone_number}
                      </a>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-wide block">Budget range</span>
                      <span className="text-xs font-extrabold text-zinc-950 dark:text-white">
                        {selectedLead.budget_range}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-455 font-bold uppercase tracking-wide block">Interested In</span>
                      <span className="text-xs font-extrabold text-zinc-955 dark:text-white capitalize">
                        {selectedLead.looking_for}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-455 font-bold uppercase tracking-wide block">Deal Purpose</span>
                      <span className="text-xs font-extrabold text-zinc-955 dark:text-white capitalize">
                        {selectedLead.purpose}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent Assignment Modifier */}
                {isAdmin && (
                  <div className="space-y-1.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wide block">
                      Assign CRM Lead Agent
                    </label>
                    <select
                      value={selectedLead.assigned_to || "none"}
                      onChange={(e) => handleAgentAssignment(selectedLead.id, e.target.value)}
                      className="w-full text-xs font-bold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-850 p-2.5 text-zinc-750 dark:text-zinc-350 shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    >
                      <option value="none">Unassigned (Claimable)</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Right Column - Chatter Timeline */}
              <div className="col-span-1 md:col-span-5 p-6 bg-zinc-50/50 dark:bg-zinc-955/20 flex flex-col justify-between min-h-[380px] max-h-[460px]">
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-850">
                    <ChatBubbleLeftRightIcon className="h-4.5 w-4.5 text-[#f97316]" />
                    <h3 className="font-extrabold text-[9px] uppercase tracking-wider text-zinc-500">
                      Chatter Logs Timeline
                    </h3>
                  </div>

                  {/* Notes Feed scroll container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                    {notes.length > 0 ? (
                      notes.map((note) => {
                        const noteInitials = note.author_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                        return (
                          <div
                            key={note.id}
                            className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex items-start gap-2.5 shadow-xs"
                          >
                            <div className="w-6.5 h-6.5 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                              {noteInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center text-[9px] text-zinc-450 font-bold mb-0.5">
                                <span className="text-zinc-705 dark:text-zinc-350 truncate max-w-[100px]">
                                  {note.author_name}
                                </span>
                                <span className="font-medium">
                                  {format(new Date(note.created_at), "MMM d, h:mm a")}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-bold break-words">
                                {note.note}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-6 text-center text-xs text-zinc-400 font-bold">
                        No follow-up action logs registered.
                      </div>
                    )}
                  </div>
                </div>

                {/* Form 업데이트 */}
                <form onSubmit={handleAddNote} className="space-y-2 mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800">
                  <Textarea
                    isRequired
                    placeholder="Log client call update..."
                    value={newNote}
                    onValueChange={setNewNote}
                    variant="bordered"
                    size="sm"
                    minRows={1.5}
                    className="w-full text-xs"
                    classNames={{
                      input: "text-xs font-semibold",
                      inputWrapper: "border-zinc-300 dark:border-zinc-750 bg-white dark:bg-zinc-900 focus-within:border-amber-500",
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      color="warning"
                      size="sm"
                      isLoading={savingNote}
                      className="font-extrabold text-xs text-white px-4 rounded-lg bg-[#f97316] hover:bg-[#ea580c]"
                    >
                      Log Update
                    </Button>
                  </div>
                </form>

              </div>

            </div>

            {/* Custom Footer */}
            <div className="flex justify-end items-center px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900">
              <button
                onClick={onDetailsClose}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-xs transition"
              >
                Done Editing
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pure Tailwind CSS Custom Delete Confirmation Modal Overlay */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-md h-auto flex flex-col p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-white">
              Remove Client Record
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed font-bold">
              Are you sure you want to permanently delete this lead record? This action will remove all notes logs and cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={onDeleteClose}
                className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
