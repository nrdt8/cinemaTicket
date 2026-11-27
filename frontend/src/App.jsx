import { Routes, Route } from "react-router-dom";

import "./styles/main.scss";
import Catalog from "./pages/Catalog/Catalog.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Catalog />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/catalog"
                element={
                    <ProtectedRoute>
                        <Catalog />
                    </ProtectedRoute>
                }
            />


            <Route path="/auth" element={<Auth />} />
        </Routes>
    );
}

export default App;