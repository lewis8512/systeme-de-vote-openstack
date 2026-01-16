import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useElector } from "../contexts/ElectorContext";
import { config } from "../config";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const { setElector } = useElector();


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/"); // vers /login
            return;
        }

        fetch(`${config.apiUrl}/electors/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((elector) => {
                // console.log("Electeur :", elector);
                setElector(elector);
                setChecking(false);
            })
            .catch(() => navigate("/"));
    }, []);

    if (checking) return LoadingScreen();

    return children;
}
