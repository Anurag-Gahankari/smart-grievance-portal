import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Pending: "bg-status-pending-bg text-status-pending-foreground",
  "In Progress": "bg-status-in-progress-bg text-status-in-progress-foreground",
  Resolved: "bg-status-resolved-bg text-status-resolved-foreground",
  Closed: "bg-status-closed-bg text-status-closed-foreground",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
