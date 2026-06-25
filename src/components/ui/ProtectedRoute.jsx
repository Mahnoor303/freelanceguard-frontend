import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, openLogin } = useAuth();
  if (!user) {
    // Redirect to landing and trigger login modal
    // We'll handle this via Landing page detecting a query param, but for simplicity
    // we can just open login modal and stay on the current page? No, better redirect.
    // We'll redirect to /?login=true and Landing will open login modal.
    return <Navigate to="/?login=true" replace />;
  }
  return children;
}