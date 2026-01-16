import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import { useEffect } from "react";
import { Candidate } from "./Vote";
import { hasVoted } from "../services/hasVoted";
import { ArrowLeft, Vote, TriangleAlert, LogOut } from 'lucide-react';
import IconButton from "../components/IconButton";
import { config } from "../config";
import { handleLogout } from "../utils/authUtils";

export default function ConfirmVote() {
    const location = useLocation();
    const navigate = useNavigate();
    const candidate: Candidate = location.state?.selectedCandidate;

    async function handleConfirm() {
        const token = localStorage.getItem("token");
        try {
            const submitVote = await fetch(`${config.apiUrl}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    candidateId: candidate.id,
                }),
            });

            if (submitVote.status === 201) {
                const voteResponse = await submitVote.json();
                const voteHash = voteResponse.voteHash;
                navigate("/success", { state: { voteHash } });
            } else if (submitVote.status === 403) {
                const forbiddenResponse = await submitVote.json();
                alert(forbiddenResponse.message);
            } else {
                alert("Une erreur inconnue est survenue. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur lors du vote", error);
            alert("Erreur réseau. Veuillez réessayer.");
        }
    }

    function handleReturn() {
        navigate("/vote");
    }

    useEffect(() => {
        document.title = "Confirmation du vote | Système de vote électronique";
        async function checkVote() {
            const result = await hasVoted();
            if (result.hasVoted) navigate("/success");
        }
        checkVote();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
        {/* Header avec logos et bouton de déconnexion */}
        <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src="/logo_republique_francaise.png"
              alt="Logo République Francaise"
              className="h-12"
            />
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
  
        <Stepper activeStep={2} />
  
        <div className="flex flex-col items-center justify-center flex-grow px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 uppercase mb-6">
            Confirmez votre vote
          </h1>
  
          {/* Candidate card */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 flex flex-col items-center shadow-lg max-w-md w-full">
            <img
              src={
                candidate.image
                  ? `data:${candidate.imageType};base64,${candidate.image}`
                  : "/public/default-avatar.png"
              }
              alt={`${candidate.name} ${candidate.surname}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white mb-4"
            />
            <h2 className="text-xl font-bold mb-1">
              {candidate.name} {candidate.surname}
            </h2>
            <p className="text-sm text-white/80 mb-3 italic">{candidate.party}</p>
          </div>
  
          {/* Alerte info */}
          <div className="flex flex-col items-center mt-4 w-full max-w-md">
            <div className="flex items-center gap-3">
              <TriangleAlert className="text-yellow-500" />
              <p className="text-sm text-gray-500">
                Votre vote est <strong>définitif</strong> et{" "}
                <strong>non modifiable</strong> après confirmation.
              </p>
            </div>
          </div>
  
          {/* Buttons */}
          <div className="flex items-center gap-4 mt-6 w-full max-w-md">
            <IconButton
              label="Changer"
              icon={<ArrowLeft />}
              onClick={handleReturn}
              theme="secondary"
              className="w-full justify-center"
            />
            <IconButton
              label="Confirmer"
              icon={<Vote />}
              onClick={handleConfirm}
              theme="primary"
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    );
}
