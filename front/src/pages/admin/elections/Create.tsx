import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config";
import { handleAdminLogout } from "../../../utils/authUtils";
import IconButton from "../../../components/IconButton";
import { ArrowLeft, LogOut } from "lucide-react";

export default function CreateElection() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const startDate = new Date(e.currentTarget.startDate.value);
    const endDate = new Date(e.currentTarget.endDate.value);

    if (endDate <= startDate) {
      setError("La date de fin doit être postérieure à la date de début.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/elections/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ title, startDate, endDate }),
      });

      if (!response.ok) throw new Error("Erreur lors de la création de l'élection");

      const data = await response.json();
      navigate(`/admin/election/${data.id}/candidates/add`, {
        state: data,
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'élection:", error);
      setError("Erreur lors de la création de l'élection. Veuillez vérifier les informations.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
        <img src="/logo_demos.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-center flex-1">Créer une élection</h1>
        <div className="flex items-center gap-2">
          <IconButton label="Retour" icon={<ArrowLeft />} onClick={() => navigate("/admin/elections")} theme="secondary" />
          <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 flex-grow">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
          <h2 className="text-xl font-semibold text-center mb-6">Informations de l'élection</h2>

          <div className="mb-4">
            <label htmlFor="title" className="block mb-1 text-gray-700">Libellé</label>
            <input
              id="title"
              name="title"
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block mb-1 text-gray-700">Date de début</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block mb-1 text-gray-700">Date de fin</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg w-full py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Création en cours..." : "Créer l'élection"}
          </button>
        </form>
      </div>
    </div>
  );
}
