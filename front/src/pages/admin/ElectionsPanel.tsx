import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../config";
import { Election } from "../../interfaces/Elections";
import { formatFrenchDate } from "../../utils/dateUtils";
import { handleAdminLogout } from "../../utils/authUtils";
import IconButton from "../../components/IconButton";
import { ArrowLeft, LogOut, Plus, Edit2 } from "lucide-react";

export default function ElectionPanel() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchElections = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/elections`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des élections");

      const data = await response.json();
      const sorted = data.sort((a: Election, b: Election) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      setElections(sorted);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des élections:", error);
      setError("Impossible de charger les élections.");
    }
  };

  const isOngoing = (start: string, end: string) => {
    const now = new Date();
    return new Date(start) <= now && now <= new Date(end);
  };

  const handleReturn = () => navigate("/admin/panel");

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" /> 
        <img src="/logo_demos.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-center flex-1">Gestion des élections</h1>
        <div className="flex items-center gap-2">
          <IconButton label="Retour" icon={<ArrowLeft />} onClick={handleReturn} theme="secondary" />
          <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <IconButton
          label="Ajouter une élection"
          icon={<Plus />}
          onClick={() => navigate("/admin/election/create")}
          theme="primary"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z" />
          </svg>
        </div>
      ) : error ? (
        <div className="flex justify-center mt-10">
          <div className="bg-red-100 text-red-800 font-medium px-6 py-4 rounded shadow">
            {error}
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-8">
          <div className="w-full max-w-5xl">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-xl font-bold text-center mb-6">Liste des élections</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Libellé</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Début</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fin</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {elections.map((election) => (
                      <tr
                        key={election.id}
                        className={`hover:bg-blue-50 cursor-pointer text-center ${isOngoing(election.startDate.toString(), election.endDate.toString()) ? "bg-green-100" : ""}`}
                        onClick={() => navigate(`/admin/election/edit/${election.id}`, { state: election })}
                      >
                        <td className="px-4 py-3">{election.id}</td>
                        <td className="px-4 py-3 flex items-center justify-center gap-2">
                          {election.title}
                          {isOngoing(election.startDate.toString(), election.endDate.toString()) && (
                            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              En cours
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{formatFrenchDate(election.startDate.toString())}</td>
                        <td className="px-4 py-3">{formatFrenchDate(election.endDate.toString())}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/election/edit/${election.id}`, { state: election })}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" /> Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {elections.length === 0 && (
                  <div className="text-center text-gray-500 mt-4 italic">Aucune élection enregistrée.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
