import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, UserIcon, LockIcon } from "lucide-react";
import SubmitButton from "../../components/SubmitButton";
import { config } from "../../config";


export default function AdminLogin() {
    const [showLogin, setShowLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [showErrorMessage, setShowErrorMessage] = useState(false);


    // useEffect is a React Hook that lets you synchronize a component with an external system.
    useEffect(() => {
        document.title = "Connexion | Système de vote électronique";

    }, []);

async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        try {
            const response = await fetch(`${config.apiUrl}/auth/admin/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                setShowErrorMessage(true);
                return;
            }

            localStorage.setItem("adminToken", data.access_token);
            console.log("Connexion réussie :", data.access_token);

            navigate("/admin/panel");

        } catch (error) {
            console.error("Erreur de connexion :", error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            navigate("/admin/panel");
        }else{
            navigate("/admin/login");
        }
    },[]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <h1 className="text-3xl font-bold text-black mb-6">Bienvenue</h1>
            <p className="text-black mb-4">
                Bienvenue au sein du Panel Administration
            </p>

            <form onSubmit={handleLogin} className="ring-1 ring-red-500/50 space-y-3 w-full max-w-md rounded-lg shadow-lg shadow-red-500/50 bg-white p-6">

                <label>
                    <span className="block text-red-600 font-semibold mb-2">Identifiant*</span>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                            <UserIcon size={20} />
                        </div>
                        <input
                            placeholder="Votre identifiant"
                            className="pl-10 pr-10 py-2 border border-red-300 rounded w-full focus:bg-red-100 focus:border-red-600 focus:outline-none"
                            name="email"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowLogin(!showLogin)}
                            tabIndex={-1}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-red-600 hover:text-red-800 hover:scale-110"
                        >
                        </button>
                    </div>
                </label>

                <label>
                    <span className="block text-red-600 font-semibold mb-2 mt-4">Mot de passe*</span>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                            <LockIcon size={20} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Votre mot de passe"
                            className="pl-10 pr-10 py-2 border border-red-300 rounded w-full focus:bg-red-100 focus:border-red-600 focus:outline-none"
                            name="password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-red-600 hover:text-red-800 hover:scale-110"
                        >
                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                </label>
                <p className="text-sm text-red-600 mt-2">{showErrorMessage ? "L'identifiant ou le mot de passe ne correspondent à aucun compte existant." : ""}</p>

                <SubmitButton text="Se connecter" />
            </form>
        </div>
    );
}
