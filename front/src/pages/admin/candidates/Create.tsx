import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from "../../../config";
import { Election } from "../../../interfaces/Elections";
import { handleAdminLogout } from "../../../utils/authUtils";
import { ArrowLeft, FileText, LogOut, Upload } from "lucide-react";
import IconButton from "../../../components/IconButton";

export default function CreateCandidate() {
  const location = useLocation();
  const passedElection = location.state as Election;
  const navigate = useNavigate();

  const electionId = passedElection.id.toString();
  const token = localStorage.getItem("adminToken");

  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const surname = e.currentTarget.surname.value;
    const party = e.currentTarget.party.value;
    const photo = e.currentTarget.photo.files?.[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("party", party);
    formData.append("electionId", electionId);
    if (photo) formData.append("photo", photo);

    try {
      const response = await fetch(`${config.apiUrl}/candidates/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error();

      setSuccessMessage("Candidat ajouté avec succès.");
    } catch (err) {
      setError("Erreur lors de l'ajout du candidat. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCsvSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("electionId", electionId ?? "6");

    try {
      const response = await fetch(`${config.apiUrl}/candidates/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error();

      setSuccessMessage("Import CSV effectué avec succès.");
    } catch (err) {
      setError("Erreur lors de l'import du fichier CSV.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
        <img src="/logo_demos.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-center flex-1">Ajout de candidats</h1>
        <div className="flex items-center gap-2">
          <IconButton label="Retour" icon={<ArrowLeft />} onClick={() => navigate("/admin/election/edit/" + electionId, { state: passedElection })} theme="secondary" />
          <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("manual")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border transition cursor-pointer ${mode === "manual"
                ? "bg-blue-500 text-white border-blue-500 shadow"
                : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
              }`}
          >
            <FileText className="w-4 h-4" />
            Ajout manuel
          </button>

          <button
            onClick={() => setMode("csv")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border transition cursor-pointer ${mode === "csv"
                ? "bg-blue-500 text-white border-blue-500 shadow"
                : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
              }`}
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
        </div>


        {successMessage && (
          <div className="bg-green-100 text-green-800 font-medium px-4 py-2 rounded border border-green-300 mb-4 max-w-xl text-center">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 font-medium px-4 py-2 rounded border border-red-300 mb-4 max-w-xl text-center">
            {error}
          </div>
        )}

        {mode === "manual" ? (
          <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-center mb-6">Ajouter un candidat</h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Prénom</label>
              <input name="name" className="w-full border border-gray-300 rounded px-4 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Nom</label>
              <input name="surname" className="w-full border border-gray-300 rounded px-4 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Partie politique</label>
              <input name="party" className="w-full border border-gray-300 rounded px-4 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Photo</label>
              <input type="file" name="photo" accept="image/*" className="w-full border border-gray-300 rounded px-4 py-2" required />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg w-full px-6 py-2 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed "
            >
              {isSubmitting ? "Chargement..." : "Ajouter le candidat"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCsvSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-center mb-6">Importer des candidats (CSV)</h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Fichier CSV</label>
              <input type="file" name="file" accept=".csv" className="w-full border border-gray-300 rounded px-4 py-2" required />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Le fichier doit contenir les colonnes : <strong>name, surname, birthDate, party</strong>.<br />
              L’image pourra être ajoutée plus tard pour chaque candidat.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg w-full px-6 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Chargement..." : "Importer le fichier"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
