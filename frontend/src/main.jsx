import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);
