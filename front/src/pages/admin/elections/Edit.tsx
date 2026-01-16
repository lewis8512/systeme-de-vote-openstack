import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { config } from "../../../config";
import { formatDateForInput } from "../../../utils/dateUtils";
import { Election } from "../../../interfaces/Elections";
import { Candidate } from "../../../interfaces/Candidates";
import { handleAdminLogout } from "../../../utils/authUtils";
import IconButton from "../../../components/IconButton";
import { ArrowLeft, LogOut } from "lucide-react";

export default function EditElection() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedElection = location.state as Election;

  const token = localStorage.getItem("adminToken");

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (new Date(value) > new Date(endDate)) {
      setDateError("La date de début ne peut pas être postérieure à la date de fin.");
    } else {
      setDateError(null);
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    if (new Date(startDate) > new Date(value)) {
      setDateError("La date de début ne peut pas être postérieure à la date de fin.");
    } else {
      setDateError(null);
    }
  };

  const fetchElectionDetails = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/elections/${passedElection.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Échec de la récupération des détails");

      const data: Election = await response.json();
      setTitle(data.title);
      setStartDate(formatDateForInput(data.startDate));
      setEndDate(formatDateForInput(data.endDate));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des détails de l'élection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/candidates/election/${passedElection.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des candidats");
      const data: Candidate[] = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des candidats.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const startDateForm = new Date(startDate);
    const endDateForm = new Date(endDate);

    if (startDateForm > endDateForm) {
      setError("La date de début ne peut pas être postérieure à la date de fin.");
      return;
    }

    try {
      const res = await fetch(`${config.apiUrl}/elections/edit/${passedElection.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, startDate: startDateForm, endDate: endDateForm }),
      });
      if (!res.ok) throw new Error("Erreur serveur");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de l'élection.");
    }
  };

  useEffect(() => {
    fetchElectionDetails();
    fetchCandidates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
        <img src="/logo_demos.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-center flex-1">Modifier l'élection</h1>
        <div className="flex items-center gap-2">
          <IconButton label="Retour" icon={<ArrowLeft />} onClick={() => navigate("/admin/elections")} theme="secondary" />
          <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-8">
        <div className="lg:w-1/2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 text-center">Modifier les détails</h2>

          {error && <div className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-800 font-medium px-4 py-2 rounded mb-4">Élection mise à jour avec succès !</div>}
          {loading ? (
            <p className="text-gray-500 italic">Chargement...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Libellé</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date de début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
                {dateError && (
                  <div className="text-red-600 text-sm font-medium mt-1">{dateError}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date de fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
                {dateError && (
                  <div className="text-red-600 text-sm font-medium mt-1">{dateError}</div>
                )}
              </div>
              <button
                type="submit"
                disabled={!!dateError}
                className={`w-full font-semibold rounded-lg px-6 py-2 mt-2 transition cursor-pointer ${dateError
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                Enregistrer les modifications
              </button>
            </form>
          )}
        </div>

        <div className="lg:w-1/2 bg-white p-6 rounded shadow max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Candidats</h2>
            <button
              onClick={() => navigate(`/admin/election/${passedElection.id}/candidates/add`, { state: passedElection })}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition duration-200 cursor-pointer"
            >
              <span className="text-lg font-semibold">+</span>
              <span className="font-medium">Ajouter un candidat</span>
            </button>
          </div>

          {candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prénom</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Parti</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-blue-50 cursor-pointer text-center"
                      onClick={() => navigate(`/admin/election/${passedElection.id}/candidates/edit/${candidate.id}`, {
                        state: {
                          candidateId: candidate.id,
                          election: passedElection,
                        },
                      })}
                    >
                      <td className="px-4 py-3">{candidate.surname}</td>
                      <td className="px-4 py-3">{candidate.name}</td>
                      <td className="px-4 py-3">{candidate.party}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/election/${passedElection.id}/candidates/edit/${candidate.id}`, {
                              state: {
                                candidateId: candidate.id,
                                election: passedElection,
                              },
                            });
                          }}
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-4 italic">Aucun candidat enregistré pour cette élection.</div>
          )}

        </div>
      </div>
    </div>
  );
}
