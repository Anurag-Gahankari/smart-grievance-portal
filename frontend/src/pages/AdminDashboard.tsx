import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Filter, UserPlus } from "lucide-react";

interface Officer {
  _id: string;
  name: string;
  email: string;
}

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedOfficer?: { _id?: string; name?: string; email?: string } | string;
  user?: { name?: string; email?: string } | string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const complaintsResponse = await api.get("/complaints");
      const complaintsData = complaintsResponse.data?.complaints || complaintsResponse.complaints || [];
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      setOfficers([]);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const assignOfficer = async (complaintId: string, officerId: string) => {
    setUpdating(complaintId);
    try {
      await api.patch(`/complaints/${complaintId}`, { assignedTo: officerId });
      toast({ title: "Assigned", description: "Officer assigned successfully." });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.patch(`/complaints/${id}`, { status });
      toast({ title: "Updated", description: `Status changed to ${status}.` });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const getUserName = (user: Complaint["user"]) => {
    if (!user) return "—";
    if (typeof user === "string") return user;
    return user.name || user.email || "—";
  };

  const getOfficerId = (officer: Complaint["assignedOfficer"]) => {
    if (!officer) return "";
    if (typeof officer === "string") return officer;
    return officer._id || "";
  };

  const getOfficerName = (officer: Complaint["assignedOfficer"]) => {
    if (!officer) return "";
    if (typeof officer === "string") return officer;
    return officer.name || officer.email || "";
  };

  const filtered = statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Complaints</h1>
            <p className="text-sm text-muted-foreground">{complaints.length} total • {officers.length} officers</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No complaints found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((c) => (
              <div key={c._id} className="animate-fade-in rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>By: {getUserName(c.user)}</span>
                      <span>•</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      {getOfficerName(c.assignedOfficer) && (
                        <>
                          <span>•</span>
                          <span>Officer: {getOfficerName(c.assignedOfficer)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                    {/* Assign Officer */}
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      <select
                        disabled={updating === c._id}
                        value={getOfficerId(c.assignedOfficer)}
                        onChange={(e) => {
                          if (e.target.value) assignOfficer(c._id, e.target.value);
                        }}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      >
                        <option value="">Assign officer...</option>
                        {officers.map((o) => (
                          <option key={o._id} value={o._id}>{o.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Update Status */}
                    <select
                      disabled={updating === c._id}
                      onChange={(e) => {
                        if (e.target.value) updateStatus(c._id, e.target.value);
                      }}
                      className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      value=""
                    >
                      <option value="">Update status...</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
