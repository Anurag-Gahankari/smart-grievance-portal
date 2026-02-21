import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="text-center animate-fade-in">
      <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold text-foreground">Access Denied</h1>
      <p className="mt-2 text-muted-foreground">You don't have permission to access this page.</p>
      <Link
        to="/login"
        className="mt-6 inline-block rounded-lg gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Back to Login
      </Link>
    </div>
  </div>
);

export default UnauthorizedPage;
