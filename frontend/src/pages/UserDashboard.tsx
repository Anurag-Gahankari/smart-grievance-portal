import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Plus, Filter } from "lucide-react";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedOfficer?: { name?: string; email?: string } | string;
  createdAt: string;
}

const UserDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({ title: "Validation", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/complaints", { title: title.trim(), description: description.trim() });
      toast({ title: "Success", description: "Complaint submitted." });
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchComplaints();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter);

  const getOfficerName = (officer: Complaint["assignedOfficer"]) => {
    if (!officer) return "—";
    if (typeof officer === "string") return officer;
    return officer.name || officer.email || "—";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Complaints</h1>
            <p className="text-sm text-muted-foreground">{complaints.length} total complaints</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Complaint
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="animate-fade-in rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Submit a Complaint</h3>
            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Complaint title"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={100}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your complaint..."
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                maxLength={1000}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter */}
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

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No complaints found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">Officer</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{c.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-xs truncate">{c.description}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{getOfficerName(c.assignedOfficer)}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
