import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Vote from "./pages/Vote";
import ConfirmVote from "./pages/ConfirmVote";
import Success from "./pages/Success";
import Results from "./pages/Results";
import RequireAuth from "./components/RequireAuth";
import AdminLogin from "./pages/admin/Login";
import AdminPanel from "./pages/admin/Panel";
import ElectionPanel from "./pages/admin/ElectionsPanel";
import ElectorPanel from "./pages/admin/ElectorsPanel";
import EditElector from "./pages/admin/electors/Edit";
import RequireAdminAuth from "./components/RequireAdminAuth";
import CreateElection from "./pages/admin/elections/Create";
import CreateCandidate from "./pages/admin/candidates/Create";
import EditElection from "./pages/admin/elections/Edit";
import EditCandidate from "./pages/admin/candidates/Edit";
import AdminResults from "./pages/admin/AdminResults";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/vote" element={<RequireAuth><Vote /></RequireAuth>} />
      <Route path="/confirm" element={<RequireAuth><ConfirmVote /></RequireAuth>} />
      <Route path="/success" element={<RequireAuth><Success /></RequireAuth>} />
      <Route path="/results" element={<RequireAuth><Results /></RequireAuth>} />
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/panel" element={<RequireAdminAuth><AdminPanel/></RequireAdminAuth>} />
      <Route path="/admin/elections" element={<RequireAdminAuth><ElectionPanel/></RequireAdminAuth>} />

      <Route path="/admin/electors" element={<RequireAdminAuth><ElectorPanel/></RequireAdminAuth>} />
      <Route path="/admin/electors/edit/:id" element={<RequireAdminAuth><EditElector/></RequireAdminAuth>} />

      <Route path="/admin/election/create" element={<RequireAdminAuth><CreateElection/></RequireAdminAuth>} />
      <Route path="/admin/election/edit/:idElection" element={<RequireAdminAuth><EditElection/></RequireAdminAuth>} />

      <Route path="/admin/election/:idElection/candidates/add" element={<RequireAdminAuth><CreateCandidate/></RequireAdminAuth>} />
      <Route path="/admin/election/:idElection/candidates/edit/:idCandidate" element={<RequireAdminAuth><EditCandidate/></RequireAdminAuth>} />

      <Route path="/admin/results" element={<RequireAdminAuth><AdminResults/></RequireAdminAuth>} />
    </Routes>
  );
}