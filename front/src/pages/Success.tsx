import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../components/Stepper";
import { hasVoted } from "../services/hasVoted";
import { formatDate } from "../utils/dateUtils";
import {
    LogOut,
    ChartColumnBig,
    CheckCircle,
    Download,
    RotateCcw,
    Copy,
    CopyCheck,
} from "lucide-react";
import IconButton from "../components/IconButton";
import { PDFDownloadLink } from "@react-pdf/renderer";
import VoteReceiptPDF from "../components/VoteReceiptPDF";
import { InputMask } from "@react-input/mask";
import { config } from "../config";

export default function Success() {
    const navigate = useNavigate();
    const location = useLocation();
    const voteHash = location.state?.voteHash ?? null;

    const [hashToCheck, setHashToCheck] = useState("");
    const [votedAt, setVotedAt] = useState<string | null>(null);
    const [checkResult, setCheckResult] = useState<null | boolean>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);
    const [copied, setCopied] = useState(false);

    const isValidUUIDv4 = (uuid: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

    const handleSeeResults = () => navigate("/results");

    const handleDisconnect = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleCopyHash = async () => {
        await navigator.clipboard.writeText(voteHash ?? "");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    async function handleVerifyHash() {
        if (!hashToCheck.trim()) return;
        setIsVerifying(true);
        setCheckResult(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${config.apiUrl}/vote/verify/${hashToCheck.trim()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setCheckResult(data.found);
            setHasChecked(true);
        } catch {
            setCheckResult(false);
            setHasChecked(true);
        } finally {
            setIsVerifying(false);
        }
    }

    useEffect(() => {
        document.title = "Vote confirmé | Système de vote électronique";
        async function checkVote() {
            const result = await hasVoted();
            if (result.hasVoted === false) {
                navigate("/vote");
            }
            else if (result.votedAt) {
                setVotedAt(result.votedAt);
            }
        }
        checkVote();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
        {/* HEADER */}
        <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
          <div className="flex items-center gap-4">
            <img src="/logo_republique_francaise.png" alt="Logo République Française" className="h-12" />
            <img src="/logo_demos.png" alt="Logo Demos" className="h-12" />
          </div>
          <div className="flex items-center">
            <IconButton
              label="Déconnexion"
              icon={<LogOut />}
              onClick={handleDisconnect}
              theme="primary"
            />
          </div>
        </header>
  
        <Stepper activeStep={3} />
  
        <div className="flex flex-col items-center justify-center flex-grow py-6">
          <div className="flex flex-col items-center text-center mb-6 transition-all duration-300 scale-95 opacity-100">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-4 shadow">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Votre vote est confirmé</h1>
            {votedAt ? (
              <p className="text-sm text-gray-600">
                Vous avez voté le{" "}
                <span className="font-medium text-gray-800">
                  {formatDate(votedAt)}
                </span>{" "}
                (heure de Paris).
              </p>
            ) : (
              <p className="text-sm text-gray-600 italic text-gray-400">
                Chargement des données de vote...
              </p>
            )}
          </div>
  
          {/* Récépissé ou vérification */}
          {voteHash && votedAt ? (
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg max-w-md w-full mb-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-lg font-semibold mb-2">📄 Récépissé de vote</h2>
  
              <div
                onClick={handleCopyHash}
                className="group relative flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 mt-2 mb-4 cursor-pointer hover:bg-white/30 transition"
              >
                <span className="text-sm break-all text-white/90">{voteHash}</span>
  
                <div className="relative">
                  {copied ? (
                    <CopyCheck className="w-4 h-4 text-green-200 transition duration-300" />
                  ) : (
                    <Copy className="w-4 h-4 transition duration-300" />
                  )}
  
                  {copied && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs text-green-200 bg-white/10 px-2 py-0.5 rounded">
                      Copié !
                    </div>
                  )}
                </div>
  
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out bg-white text-gray-800 text-xs px-2 py-1 rounded shadow z-10 pointer-events-none">
                  Cliquer pour copier le hash
                </div>
              </div>
  
              <p className="text-sm text-white/90 mb-4">
                Ce récépissé vous permet de vérifier la présence de votre
                bulletin dans l'urne. Veuillez le conserver.
              </p>
  
              <PDFDownloadLink
                document={<VoteReceiptPDF hash={voteHash} date={formatDate(votedAt)} />}
                fileName="recipisse-de-vote.pdf"
              >
                {({ loading }) => (
                  <IconButton
                    label={loading ? "Génération..." : "Télécharger le PDF"}
                    icon={<Download className="w-5 h-5" />}
                    theme="secondary"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                  />
                )}
              </PDFDownloadLink>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg max-w-md w-full mb-6 flex flex-col items-center justify-center text-center">
              {!hasChecked ? (
                <>
                  <h2 className="text-lg font-semibold mb-2">🔍 Vérifier un récépissé</h2>
                  <p className="text-sm text-white/90 mb-4">
                    Entrez votre récépissé de vote pour vérifier s'il est bien
                    présent dans l'urne.
                  </p>
  
                  <InputMask
                    mask="********-****-****-****-************"
                    replacement={{ "*": /\w/ }}
                    value={hashToCheck}
                    onChange={(e) => setHashToCheck(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-300 placeholder-gray-400 text-sm mb-1 shadow-sm"
                    disabled={isVerifying}
                  />
  
                  {hashToCheck && !isValidUUIDv4(hashToCheck) && (
                    <p className="text-red-200 text-xs mb-2">
                      Format UUID v4 invalide. Vérifiez votre récépissé.
                    </p>
                  )}
  
                  <IconButton
                    label={isVerifying ? "Vérification..." : "Vérifier"}
                    icon={
                      isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )
                    }
                    onClick={handleVerifyHash}
                    theme="secondary"
                    className="w-full justify-center"
                    disabled={isVerifying || !isValidUUIDv4(hashToCheck)}
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle
                      className={`w-6 h-6 ${checkResult ? "text-green-200" : "text-red-200"} animate-pulse`}
                    />
                    <h2 className="text-lg font-semibold">
                      {checkResult
                        ? "Bulletin trouvé dans l'urne"
                        : "Bulletin non trouvé"}
                    </h2>
                  </div>
  
                  <p className="text-sm text-white/90 mb-2">
                    {checkResult
                      ? "Votre récépissé est bien présent pour cette élection."
                      : "Aucun bulletin correspondant à ce hash n'a été trouvé."}
                  </p>
  
                  <IconButton
                    label="Réessayer"
                    icon={<RotateCcw className="w-5 h-5" />}
                    theme="secondary"
                    onClick={() => {
                      setHasChecked(false);
                      setCheckResult(null);
                      setHashToCheck("");
                      setCopied(false);
                    }}
                    className="bg-white text-blue-700 hover:bg-blue-50 font-semibold group"
                  />
                </>
              )}
            </div>
          )}
  
          {/* Boutons actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <IconButton
              onClick={handleSeeResults}
              icon={<ChartColumnBig className="w-5 h-5" />}
              theme="primary"
              label="Voir les résultats"
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    );
}
