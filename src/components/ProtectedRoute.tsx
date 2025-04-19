import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  

  return children;
}