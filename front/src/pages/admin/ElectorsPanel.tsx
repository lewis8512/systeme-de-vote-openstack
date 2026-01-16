import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elector } from "../../interfaces/Electors";
import { formatFrenchDate } from "../../utils/dateUtils";
import { config } from "../../config";
import { handleAdminLogout } from "../../utils/authUtils";
import IconButton from "../../components/IconButton";
import { ArrowLeft, LogOut, Plus, Edit2 } from "lucide-react";

export default function ElectorPanel() {
    const [users, setUsers] = useState<Elector[]>([]);
    const [searchField, setSearchField] = useState("name");
    const [searchValue, setSearchValue] = useState("");
    const [showImportModal, setShowImportModal] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    const fetchUsers = async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return navigate("/admin/login");

        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/electors`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Erreur lors de la récupération des électeurs");

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des électeurs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCsvSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setImportError(null);
        setImportSuccess(false);

        const token = localStorage.getItem("adminToken");
        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch(`${config.apiUrl}/electors/import`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error("Erreur lors de l'import du CSV");

            await response.json();
            setImportSuccess(true);
            fetchUsers();
        } catch (err) {
            console.error(err);
            setImportError("Erreur lors de l'import du fichier CSV.");
        }
    };

    const filteredUsers = users.filter((user) => {
        const value = user[searchField as keyof Elector];
        return value?.toString().toLowerCase().includes(searchValue.toLowerCase());
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
                <img src="/logo_demos.png" alt="Logo" className="h-12" />
                <h1 className="text-2xl font-bold text-center flex-1">Gestion des électeurs</h1>
                <div className="flex items-center gap-2">
                    <IconButton label="Retour" icon={<ArrowLeft />} onClick={() => navigate("/admin/panel")} theme="secondary" />
                    <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-grow">
                <div className="lg:w-1/4 p-6 border-r bg-white">
                    <h2 className="text-lg font-semibold mb-4">Recherche</h2>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par</label>
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 cursor-pointer"
                    >
                        <option value="idCardNumber">CNI</option>
                        <option value="surname">Nom</option>
                        <option value="name">Prénom</option>
                        <option value="birthPlace">Ville</option>
                        <option value="birthDate">Date de naissance</option>
                        <option value="email">Email</option>
                    </select>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        placeholder="Entrez une valeur..."
                    />
                    <IconButton
                        label="Ajouter des électeurs"
                        icon={<Plus />}
                        onClick={() => setShowImportModal(true)}
                        theme="primary"
                        className="w-full"
                    />
                </div>

                <div className="lg:w-3/4 p-6">
                    <h2 className="text-xl font-bold mb-4 text-center">Liste des électeurs</h2>
                    {message && (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center shadow">
                            {message}
                        </div>
                    )}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="min-w-full divide-y divide-gray-200 text-center">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {["ID", "CNI", "Nom", "Prénom", "Naissance", "Ville", "Email", "Actions"].map((th) => (
                                            <th key={th} className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">{th}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => navigate(`/admin/electors/edit/${user.id}`, { state: user })}>
                                            <td className="px-4 py-3">{user.id}</td>
                                            <td className="px-4 py-3">{user.idCardNumber}</td>
                                            <td className="px-4 py-3">{user.surname}</td>
                                            <td className="px-4 py-3">{user.name}</td>
                                            <td className="px-4 py-3">{formatFrenchDate(user.birthDate.toString())}</td>
                                            <td className="px-4 py-3">{user.birthPlace}</td>
                                            <td className="px-4 py-3">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/electors/edit/${user.id}`, { state: user });
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4" /> Modifier
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center text-gray-500 mt-4 italic">Aucun électeur trouvé.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showImportModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
                            onClick={() => setShowImportModal(false)}
                            aria-label="Fermer la modale"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4 text-center">Importer des électeurs (CSV)</h2>

                        <form onSubmit={handleCsvSubmit}>
                            <input
                                type="file"
                                name="file"
                                accept=".csv"
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-3 cursor-pointer"
                            />

                            <p className="text-sm text-gray-500 mb-4">
                                Le fichier doit contenir les colonnes :
                                <strong> name, surname, birthDate, birthPlace, idCardNumber, email, password</strong>.
                            </p>

                            {importError && (
                                <div className="bg-red-100 text-red-700 border border-red-300 rounded px-4 py-3 mb-4">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-9-4a1 1 0 012 0v4a1 1 0 11-2 0V6zm0 6a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" />
                                        </svg>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-sm">{importError}</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImportError(null);
                                                    setImportSuccess(false);
                                                }}
                                                className="self-start inline-flex items-center gap-1 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded px-3 py-1 transition cursor-pointer"
                                            >
                                                Réessayer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {importSuccess && (
                                <div className="bg-green-100 text-green-700 border border-green-300 rounded px-4 py-3 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Import réussi !</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowImportModal(false)}
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition cursor-pointer"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer">
                                Importer le fichier
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
