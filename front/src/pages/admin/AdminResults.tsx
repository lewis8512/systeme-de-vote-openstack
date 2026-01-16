import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { io } from "socket.io-client"; // Importer socket.io-client
import IconButton from "../../components/IconButton";
import { ArrowLeft, LogOut } from "lucide-react";
import { config } from "../../config";
import { handleAdminLogout } from "../../utils/authUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const socket = io(`${config.socketUrl}/admin-results`, { withCredentials: true }); // Utiliser le namespace admin-results

export default function AdminResults() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalElectors, setTotalElectors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Résultats Admin | Système de vote électronique";

    const adminToken = localStorage.getItem("adminToken");

    // Récupérer les résultats initiaux
    fetch(`${config.apiUrl}/elections/admin-results`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data.candidates);
        setTotalVotes(data.totalVotes);
        setTotalElectors(data.totalElectors);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des résultats :", err);
        setLoading(false);
      });

    // Écouter les mises à jour via le socket
    socket.on("adminVoteUpdate", (data) => {
      setCandidates(data.candidates);
      setTotalVotes(data.totalVotes);
    });

    // Nettoyer les écouteurs de socket à la fin
    return () => {
      socket.off("adminVoteUpdate");
    };
  }, []);

  const participationRate = useMemo(() => {
    return totalElectors > 0 ? ((totalVotes / totalElectors) * 100).toFixed(2) : "0.00";
  }, [totalVotes, totalElectors]);

  const winningCandidate = useMemo(() => {
    if (candidates.length === 0) return null;
    return candidates.reduce((prev, current) => (current.votes > prev.votes ? current : prev), candidates[0]);
  }, [candidates]);


  const chartData = useMemo(() => {
    return {
      labels: candidates.map((candidate) => `${candidate.name}`),
      datasets: [
        {
          label: "Votes",
          data: candidates.map((candidate) => candidate.votes),
          backgroundColor: candidates.map((_, index) => getColorByIndex(index)),
          borderWidth: 1,
        },
      ],
    };
  }, [candidates]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw as number;
            const percentage = totalVotes > 0 ? ((value / totalVotes) * 100).toFixed(1) : "0.0";
            return `${value} votes (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Nombre de votes" },
        ticks: {
          callback: function (tickValue: string | number) {
            const numericValue = typeof tickValue === "string" ? parseFloat(tickValue) : tickValue;
            return Number.isInteger(numericValue) ? numericValue : null; // Affiche uniquement les entiers
          },
        },
      },
    },
  };

  function getColorByIndex(index: number): string {
    const colors = ["#3B82F6", "#EF4444", "#10B981", "#FACC15", "#8B5CF6"];
    return colors[index % colors.length];
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
        <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />
        <img src="/logo_demos.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-center flex-1">Résultats de l'élection en direct</h1>
        <div className="flex items-center">
          <IconButton
            label="Déconnexion"
            icon={<LogOut />}
            onClick={() => handleAdminLogout(navigate)}
            theme="primary"
          />
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 mb-10">

              <div className="flex-[2] h-[500px] bg-white p-4 rounded-lg shadow-md">
                <Bar
                  data={chartData}
                  options={{ ...chartOptions, maintainAspectRatio: false }}
                />
              </div>
              <div className="flex-[1] flex flex-col h-[500px]">
                <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-center">
                <h2 className="text-lg font-semibold mb-4 text-center">Statistiques</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Taux de participation :</strong> {participationRate}%</li>
                    <li><strong>Total des votes :</strong> {totalVotes}</li>
                    <li><strong>Nombre total d'électeurs :</strong> {totalElectors}</li>
                    <li>
                      <strong>Candidat en tête :</strong>{" "}
                      {winningCandidate
                        ? `${winningCandidate.name || "Inconnu"} ${winningCandidate.surname || ""} (${winningCandidate.votes} votes)`
                        : "Aucun candidat"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <IconButton
                label="Retour"
                icon={<ArrowLeft />}
                onClick={() => navigate("/admin/panel")}
                theme="secondary"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}