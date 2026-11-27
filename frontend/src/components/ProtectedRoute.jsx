import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth.jsx";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;