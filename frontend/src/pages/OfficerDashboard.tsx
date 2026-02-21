import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  user?: { name?: string; email?: string } | string;
}

const validTransitions: Record<string, string[]> = {
  Pending: ["In Progress"],
  "In Progress": ["Resolved", "Closed"],
  Resolved: ["Closed"],
  Closed: [],
};

const OfficerDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchComplaints = useCallback(async () => {
    try {
      const response = await api.get("/complaints");
      const complaintsData = response.data?.complaints || response.complaints || [];
      setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.patch(`/complaints/${id}`, { status });
      toast({ title: "Updated", description: `Status changed to ${status}.` });
      fetchComplaints();
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assigned Complaints</h1>
          <p className="text-sm text-muted-foreground">{complaints.length} complaints assigned to you</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : complaints.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No complaints assigned yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {complaints.map((c) => {
              const transitions = validTransitions[c.status] || [];
              return (
                <div key={c._id} className="animate-fade-in rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>By: {getUserName(c.user)}</span>
                        <span>•</span>
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={c.status} />
                      {transitions.length > 0 && (
                        <select
                          disabled={updating === c._id}
                          onChange={(e) => {
                            if (e.target.value) updateStatus(c._id, e.target.value);
                          }}
                          className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                          value=""
                        >
                          <option value="">Update status...</option>
                          {transitions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OfficerDashboard;
