import { Navigate } from "react-router-dom";
import { useAuthUser } from "./AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuthUser();

  if (loading) {
    
    return (
      
      <div class="spinner-grow" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    );
  }
  
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default RequireAuth;