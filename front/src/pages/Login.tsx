import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, UserIcon, LockIcon } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";
import { formatDate } from "../utils/dateUtils";
import SubmitButton from "../components/SubmitButton";
import { hasVoted } from "../services/hasVoted";
import { config } from "../config";

type ElectionDate = {
    title: string;
    startDate: string;
    endDate: string;
  };

export default function Login() {
    const [showLogin, setShowLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [electionDates, setElectionDates] = useState<ElectionDate>({
        title: '',
        startDate: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [step, setStep] = useState<"login" | "otp">("login");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [credentials, setCredentials] = useState({ idCardNumber: "", password: "" });
    const navigate = useNavigate();

    // useEffect is a React Hook that lets you synchronize a component with an external system.
    useEffect(() => {
        document.title = "Connexion | Système de vote électronique";

        // Check if the user is already logged
        const token = localStorage.getItem("token");
        if (token) {
            hasVoted().then((result) => { // verify if the user has a valid token and if he has already voted
                if (result.hasVoted) navigate("/success");
            });
        }

        fetch(`${config.apiUrl}/elections/current`)
            .then(res => res.json())
            .then(setElectionDates)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const login = event.currentTarget.login.value;
        const password = event.currentTarget.password.value;

        setCredentials({ idCardNumber: login, password });

        try {
            const response = await fetch(`${config.apiUrl}/otp/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idCardNumber: login, password }),
            });

            if (!response.ok) {
                setShowErrorMessage(true);
                return;
            }

            const data = await response.json();

            // MODE DEMO: Affiche l'OTP dans la console du navigateur
            if (data.demoMode && data.demoOtp) {
                console.log("%c========================================", "color: #2563eb; font-weight: bold;");
                console.log("%c[MODE DEMO] OTP désactivé pour faciliter les tests", "color: #dc2626; font-weight: bold;");
                console.log("%cVotre code OTP: " + data.demoOtp, "color: #16a34a; font-size: 18px; font-weight: bold;");
                console.log("%c========================================", "color: #2563eb; font-weight: bold;");
            }

            setStep("otp");
        } catch (error) {
            console.error("Erreur lors de la demande OTP :", error);
        }
    }

    async function handleOtpSubmit(e: React.FormEvent) {
        e.preventDefault();
        const code = otp.join("");

        const response = await fetch(`${config.apiUrl}/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idCardNumber: credentials.idCardNumber, otp: code }),
        });

        const data = await response.json();

        // TODO: améliorer (ex: toast)
        if (!response.ok) {
            alert("Code invalide ou expiré");
            return;
        }

        localStorage.setItem("token", data.access_token);
        console.log("Connexion réussie :", data.access_token);

        const result = await hasVoted();
        if (result.hasVoted) {
            navigate("/success");
        }
        else {
            navigate("/vote");
        }
    }

    function handleOtpPaste(event: React.ClipboardEvent<HTMLInputElement>) {
        const pasteData = event.clipboardData.getData("text");
        if (/^\d{6}$/.test(pasteData)) { // Vérifie si le texte collé est un code OTP valide (6 chiffres)
            const newOtp = pasteData.split("");
            setOtp(newOtp);

            // Met le focus sur le dernier champ rempli
            inputsRef.current[newOtp.length - 1]?.focus();
        }
    }

    function handleOtpChange(index: number, value: string) {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    if (loading) return <LoadingScreen />;

    return (

        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
            <header className="flex items-center justify-between p-4 border-b bg-gray-50 shadow-sm">
                <img src="/logo_republique_francaise.png" alt="Logo République Française" className="h-12" />
                <img src="/logo_demos.png" alt="Logo Démos" className="h-12" />
                <div className="w-full" /> {/* Espace réservé pour garder l'équilibre */}
            </header>
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
                <h1 className="text-3xl font-bold text-black mb-6">Bienvenue</h1>


                {/* Infos dates élection */}
                <p className="text-black mb-4 text-center">
                    L'élection <i><strong>{electionDates.title}</strong></i> est ouverte du <strong>{formatDate(electionDates.startDate)}</strong>{' '}
                    au <strong>{formatDate(electionDates.endDate)}</strong>.
                </p>

                <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
                    {step === "login" ? "Veuillez vous connecter pour continuer" : "Saisissez le code reçu par email"}
                </h2>


                {step === "login" ? (
                    <form onSubmit={handleLogin} className="ring-1 ring-blue-500/50 space-y-3 w-full max-w-md rounded-lg shadow-lg shadow-blue-500/50 bg-white p-6">

                        <label>
                            <span className="block text-blue-600 font-semibold mb-2">Identifiant*</span>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <UserIcon size={20} />
                                </div>
                                <input
                                    name="login"
                                    type={showLogin ? "text" : "password"}
                                    placeholder="Votre identifiant"
                                    className="pl-10 pr-10 py-2 border border-blue-300 rounded w-full focus:bg-blue-100 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLogin(!showLogin)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 hover:text-blue-800 hover:scale-110"
                                    tabIndex={-1}
                                >
                                    {showLogin ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                            </div>
                        </label>

                        <label>
                            <span className="block text-blue-600 font-semibold mb-2 mt-4">Mot de passe*</span>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <LockIcon size={20} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Votre mot de passe"
                                    className="pl-10 pr-10 py-2 border border-blue-300 rounded w-full focus:bg-blue-100 focus:border-blue-600 focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-blue-600 hover:text-blue-800 hover:scale-110"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                            </div>
                        </label>

                        {showErrorMessage && <p className="text-sm text-red-600 mt-2">Identifiant ou mot de passe incorrect</p>}

                        <SubmitButton text="Se connecter" />
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-4 w-full max-w-md rounded-lg p-6 bg-white ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/50">

                        <div className="flex justify-between space-x-2">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => { inputsRef.current[idx] = el }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, idx)}
                                    onPaste={handleOtpPaste}
                                    className="w-12 h-12 text-center text-xl font-mono font-bold border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    autoFocus={idx === 0}
                                />
                            ))}
                        </div>

                        <SubmitButton text="Valider la connexion" />
                    </form>
                )}
                <div className="w-full max-w-3xl bg-gray-100 p-6 rounded-lg shadow-md text-gray-800 my-8">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">À quoi sert ce site ?</h3>
                    <p className="mb-3">
                        Ce site vous permet de participer à une élection de manière <strong>sécurisée</strong> et <strong>confidentielle</strong>.
                    </p>
                    <h4 className="text-md font-semibold mb-2 text-blue-600">Comment se connecter ?</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Munissez-vous de votre <strong>numéro de carte d'identité</strong>.</li>
                        <li>Utilisez le <strong>mot de passe </strong> reçu par courrier.</li>
                        <li>Un <strong>code de vérification (OTP)</strong> vous sera envoyé par email après votre connexion.</li>
                        <li>Saisissez ce code pour finaliser votre authentification.</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
