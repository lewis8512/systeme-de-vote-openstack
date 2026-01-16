import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAdminAuth({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
            navigate("/admin/login"); // Redirige vers /admin/login si pas de token
            return;
        }

    }, []);

    return children;
}
