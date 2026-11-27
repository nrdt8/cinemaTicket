import { useContext } from "react";
import AuthContext from "./AuthContext.jsx";

export default function useAuth() {
    return useContext(AuthContext);
}