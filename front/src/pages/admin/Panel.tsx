import { useNavigate } from "react-router-dom";
import { handleAdminLogout } from "../../utils/authUtils";
import { LogOut } from "lucide-react";
import IconButton from "../../components/IconButton";

export default function AdminPanel() {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => navigate(path);

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
                <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
                <img src="/logo_demos.png" alt="Logo" className="h-12" />
                <h1 className="text-2xl font-bold text-center flex-1">Administration</h1>
                <div className="flex items-center">
                    <IconButton
                        label="Déconnexion"
                        icon={<LogOut />}
                        onClick={() => handleAdminLogout(navigate)}
                        theme="primary"
                    />
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full">
                    <button
                        type="button"
                        onClick={() => handleNavigate("/admin/electors")}
                        className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl hover:scale-105 transition-transform"
                    >
                        <h2 className="text-xl font-bold text-gray-800">Utilisateurs</h2>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleNavigate("/admin/elections")}
                        className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl hover:scale-105 transition-transform"
                    >
                        <h2 className="text-xl font-bold text-gray-800">Élections</h2>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleNavigate("/admin/results")}
                        className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl hover:scale-105 transition-transform"
                    >
                        <h2 className="text-xl font-bold text-gray-800">Résultats</h2>
                    </button>
                </div>
            </main>
        </div>
    );
}