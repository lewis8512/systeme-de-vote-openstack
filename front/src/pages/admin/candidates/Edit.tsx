import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { config } from "../../../config";
import { Candidate } from "../../../interfaces/Candidates";
import { convertByteObjectToBlobUrl } from "../../../utils/imageUtils";
import { handleAdminLogout } from "../../../utils/authUtils";
import { ArrowLeft, LogOut } from "lucide-react";
import IconButton from "../../../components/IconButton";

export default function EditCandidate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidateId, election } = location.state;
  
  const [candidate, setCandidate] = useState<Candidate>();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [party, setParty] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("adminToken");

  const fetchCandidateDetails = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/candidates/${candidateId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status} : ${text}`);
      const data: Candidate = JSON.parse(text);

      setCandidate(data);
      setName(data.name);
      setSurname(data.surname);
      setParty(data.party);
      if (data.image) setPhotoUrl(convertByteObjectToBlobUrl(data.image));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des détails du candidat.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("party", party);
    formData.append("electionId", String(candidate?.electionId));
    if (photoFile) formData.append("image", photoFile);

    try {
      const response = await fetch(`${config.apiUrl}/candidates/edit/${candidate?.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du candidat.");
    }
  };

  useEffect(() => {
    fetchCandidateDetails();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <img src="/logo_republique_francaise.png" alt="Logo République Francaise" className="h-12" />

        <img src="/logo_demos.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-center flex-1">Modifier un candidat</h1>
        <div className="flex items-center gap-2">
          <IconButton label="Retour" icon={<ArrowLeft />} onClick={() => navigate("/admin/election/edit/" + candidate?.electionId, { state: election })} theme="secondary" />
          <IconButton label="Déconnexion" icon={<LogOut />} onClick={() => handleAdminLogout(navigate)} theme="primary" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col lg:flex-row w-full max-w-5xl gap-10">
          <form onSubmit={handleSubmit} className="flex-1">
            <h2 className="text-xl font-semibold text-center mb-6">Informations du candidat</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                Candidat mis à jour avec succès.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                name="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parti politique</label>
              <input
                name="party"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPhotoFile(e.target.files[0]);
                    setPhotoUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full border border-gray-300 rounded px-4 py-2 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-4 cursor-pointer"
            >
              Enregistrer les modifications
            </button>
          </form>

          <div className="flex-1 flex flex-col items-center justify-center">
            {photoUrl ? (
              <>
                <p className="text-gray-700 mb-2">Photo actuelle :</p>
                <img
                  src={photoUrl}
                  alt="Photo du candidat"
                  className="w-full max-w-sm rounded-xl object-cover shadow-md"
                />
              </>
            ) : (
              <p className="italic text-gray-500 text-center">
                Ce candidat n’a pas encore de photo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
