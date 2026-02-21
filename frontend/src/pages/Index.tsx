import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  if (user) {
    const redirectMap: Record<string, string> = {
      user: "/dashboard",
      officer: "/officer",
      admin: "/admin",
    };
    return <Navigate to={redirectMap[user.role] || "/dashboard"} replace />;
  }
  return <Navigate to="/login" replace />;
};

export default Index;
