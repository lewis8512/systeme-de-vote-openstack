import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CandidateResult from "../components/CandidateResult";
import BarChart from "../components/BarChart";
import { io } from "socket.io-client";
import IconButton from "../components/IconButton";
import { ArrowLeft, LogOut } from "lucide-react";
import { config } from "../config";
import { handleLogout } from "../utils/authUtils";

const socket = io(`${config.socketUrl}`, {
    withCredentials: true,
  });

export default function Results() {
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState<any[]>([]);

    useEffect(() => {
        document.title = "Résultats | Système de vote électronique";

        // get results from API
        fetch(`${config.apiUrl}/elections/results`)
            .then((res) => res.json())
            .then((data) => {
                setCandidates(data);
            });

        // listen to vote updates from socket
        socket.on("voteUpdate", (data) => {
            setCandidates(data);
        });

        return () => {
            socket.off("voteUpdate");
        };
    }, []);

    const results = useMemo(() => {
        const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

        const formattedCandidates = candidates.map((c, index) => ({
            ...c,
            percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : "0.0",
            color: getColorByIndex(index),
        }));

        const winnerName = formattedCandidates.reduce(
            (prev, curr) => (curr.votes > prev.votes ? curr : prev),
            formattedCandidates[0]
        )?.name;

        return {
            totalVotes,
            formattedCandidates,
            winnerName,
        };
    }, [candidates]);

    function getColorByIndex(index: number): string {
        const colorPalette = ["#3B82F6", "#EF4444", "#10B981", "#FACC15"]; // bleu, rouge, vert, jaune
        return colorPalette[index] || "#6B7280"; // gris si plus de 4 candidats
    }


    function handleReturn(): void {
        navigate("/success");
    }

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
          <div className="flex items-center gap-4">
            <img src="/logo_republique_francaise.png" alt="Logo République Française" className="h-12" />
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
  
        {/* Main content */}
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <h1 className="text-2xl font-bold mb-4">Résultats en temps réel</h1>
  
          <div className="w-full max-w-4xl">
            <BarChart candidates={results.formattedCandidates} />
          </div>
  
          <div className="mt-6 w-full max-w-4xl space-y-4">
            {results.formattedCandidates.map((candidate) => (
              <CandidateResult
                key={candidate.name}
                name={candidate.name}
                party={candidate.party}
                votes={candidate.votes}
                percentage={candidate.percentage}
                color={candidate.color}
                isWinner={candidate.name === results.winnerName}
              />
            ))}
          </div>
  
          <div className="mt-8">
            <IconButton
              label="Retour"
              icon={<ArrowLeft />}
              onClick={handleReturn}
              theme="secondary"
            />
          </div>
        </div>
      </div>
    );
}
