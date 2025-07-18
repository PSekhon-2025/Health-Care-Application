// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientForm from "./pages/PatientForm";
import Dashboard from "./pages/Dashboard";
import PatientRegistration from "./pages/PatientRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import PendingActions from "./pages/PendingActions";
import CreateCamp from "./pages/CreateCamp";
import Analytics from "./pages/Analytics";
import Camp from "./pages/Camp";
import EditPatient from "./pages/EditPatient";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/pendingActions" element={<PendingActions />} />
        <Route path="/patient" element={<PatientForm />} />
        <Route path="/patient-registration" element={<PatientRegistration />} />
        <Route path="/createCamp" element={<CreateCamp />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/camp" element={<Camp />} />
        <Route path="/edit-patient/:gov_id" element={<EditPatient />} />
        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
