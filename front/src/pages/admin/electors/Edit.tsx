import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Elector } from "../../../interfaces/Electors";
import { formatDateForInput } from "../../../utils/dateUtils";
import { config } from "../../../config";
import { handleAdminLogout } from "../../../utils/authUtils";
import IconButton from "../../../components/IconButton";
import { ArrowLeft, LogOut, Trash2 } from "lucide-react";

export default function EditElector() {
    const location = useLocation();
    const passedUser = location.state;
    const { id } = useParams<{ id: string }>();
    const [elector, setElector] = useState<Elector | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setElector(passedUser);
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!elector) return;
        setElector({ ...elector, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!elector) return;

        const updatedElector = {
            ...elector,
            birthDate: new Date(elector.birthDate),
        };

        try {
            const response = await fetch(`${config.apiUrl}/electors/edit`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify(updatedElector),
                credentials: "include",
            });

            if (!response.ok) {
                setError("Une erreur est survenue lors de la mise à jour de l'électeur. Veuillez réessayer.");
                return;
            }

            await navigate("/admin/electors", {
                state: { message: `L'électeur #${elector.id} a été mis à jour avec succès` },
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'électeur:", error);
        }
    };

    const handleDelete = async () => {
        if (!elector) return;

        try {
            const response = await fetch(`${config.apiUrl}/electors/delete`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({ id: elector.id }),
                credentials: "include",
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression de l'électeur");

            await navigate("/admin/electors", {
                state: { message: `L'électeur #${elector.id} a été supprimé avec succès` },
            });
        } catch (error) {
            console.error("Erreur lors de la suppression de l'électeur:", error);
        }
    };

    if (!elector) return <p className="p-4">Chargement...</p>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
                <img src="/logo_demos.png" alt="Logo" className="h-12" />
                <h1 className="text-2xl font-bold text-center flex-1">Modifier l'électeur</h1>
                <div className="flex items-center gap-2">
                    <IconButton label="Retour" icon={<ArrowLeft />} onClick={() => navigate("/admin/electors")} theme="secondary" />
                    <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
                    <h2 className="text-xl font-semibold mb-4">Modifier les informations de l'électeur #{elector.id}</h2>

                    <div className="grid grid-cols-1 gap-4">
                        <InputField label="CNI" name="idCardNumber" value={elector.idCardNumber} onChange={handleChange} />
                        <InputField label="Nom" name="name" value={elector.name} onChange={handleChange} />
                        <InputField label="Prénom" name="surname" value={elector.surname} onChange={handleChange} />
                        <InputField label="Date de naissance" name="birthDate" type="date" value={formatDateForInput(elector.birthDate)} onChange={handleChange} />
                        <InputField label="Lieu de naissance" name="birthPlace" value={elector.birthPlace} onChange={handleChange} />
                        <InputField label="Email" name="email" type="email" value={elector.email} onChange={handleChange} />
                    </div>

                    {error && <div className="text-red-600 font-semibold mt-4 text-center">{error}</div>}

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-6 py-2 px-6 rounded-lg w-full"
                    >
                        Enregistrer les modifications
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Suppression définitive de l'électeur</p>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                        <Trash2 className="inline-block mr-2 w-4 h-4" /> Supprimer l'électeur
                    </button>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, name, value, onChange, type = "text" }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
            />
        </div>
    );
}
