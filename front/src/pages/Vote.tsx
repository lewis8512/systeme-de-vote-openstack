import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import Stepper from "../components/Stepper";
import SubmitButton from "../components/SubmitButton";
import { hasVoted } from "../services/hasVoted";
import { config } from "../config";
import { CheckCircle, LogOut, User } from "lucide-react";
import { detectMimeType } from "../utils/imageUtils";
import IconButton from "../components/IconButton";
import { handleLogout } from "../utils/authUtils";

export interface Candidate {
  id: number;
  name: string;
  surname: string;
  party: string;
  image: string;
  imageType: string;
}

const fetchCandidates = async () => {
  const response = await fetch(`${config.apiUrl}/candidates`);
  if (!response.ok) throw new Error("Erreur lors de la récupération des candidats");
  const responseJson = await response.json();

  const candidates = responseJson.map((candidate: Candidate) => {
    if (!candidate.image) return candidate;

    const byteArray = Object.values(candidate.image);
    const uint8Array = new Uint8Array(byteArray.map(Number));
    const mimeType = detectMimeType(byteArray.map(Number));
    const binary = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), "");
    const base64String = btoa(binary);

    return {
      ...candidate,
      image: base64String,
      imageType: mimeType,
    };
  });

  return candidates;
};

export default function Vote() {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Choisir un candidat | Système de vote électronique";

    async function checkVote() {
      const result = await hasVoted();
      if (result.hasVoted) navigate("/success");
    }

    checkVote();

    fetchCandidates()
      .then((candidates) => {
        setCandidates(candidates);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function handleVote(event: React.FormEvent) {
    event.preventDefault();
    if (selectedCandidate) {
      navigate("/confirm", { state: { selectedCandidate } });
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
    <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
      <div className="flex items-center gap-4">
        <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
        <img src="/logo_demos.png" alt="Logo Demos" className="h-12" />
      </div>
      <div className="flex items-center">
        <IconButton
        label="Déconnexion"
        icon={<LogOut />}
        onClick={() => handleLogout(navigate)}
        theme="primary"
        />
      </div>
    </header>

      <Stepper activeStep={1} />

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Choisissez un candidat</h1>

        <form onSubmit={handleVote} className="grid gap-6 w-full max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {candidates?.map((candidate) => {
              const isSelected = selectedCandidate?.id === candidate.id;
              return (
                <label
                  key={candidate.id}
                  className={`relative group transition-all duration-300 cursor-pointer border-2 rounded-2xl p-4 shadow-md flex flex-col items-center text-center ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-300 scale-[1.02] shadow-blue-200"
                      : "border-gray-200 hover:shadow-lg hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate.id}
                    className="sr-only"
                    onChange={() => setSelectedCandidate(candidate)}
                    required
                  />

                  {/* Badge "Sélectionné" */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
                      <CheckCircle className="w-4 h-4" />
                      Sélectionné
                    </div>
                  )}

                  {/* Avatar */}
                  <img
                    src={
                      candidate.image
                        ? `data:${candidate.imageType};base64,${candidate.image}`
                        : "/public/default-avatar.png"
                    }
                    className="w-24 h-24 rounded-full object-cover border-2 border-white mb-3 shadow"
                    alt={`${candidate.name} ${candidate.surname}`}
                  />

                  {/* Nom + icône */}
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-semibold">
                      {candidate.name} {candidate.surname.toUpperCase()}
                    </span>
                  </div>

                  {/* Parti */}
                  <span className="text-sm text-gray-500 italic">{candidate.party}</span>
                </label>
              );
            })}
          </div>

          <SubmitButton text="Suivant" disabled={!selectedCandidate} />
        </form>
      </div>
    </div>
  );
}
