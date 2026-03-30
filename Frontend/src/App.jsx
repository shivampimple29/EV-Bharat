import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute"; 

/* Landing */
import Hero from "./components/landing_page/Hero";
import About from "./components/landing_page/About";
import FAQ from "./components/landing_page/FAQ";

/* Auth */
import Auth from "./components/Auth";
import Login from "./components/Login";

/* Stations */
import StationList from "./components/Stationlist/StationList";
import StationDetail from "./components/Stationlist/StationDetail";


/* User */
import UserProfile from "./components/After login/User/UserProfile";
import BookSlot from "./components/After login/User/BookSlot";

/* Station Management */
import AddStation from "./components/After login/Charging Station/AddStation";
import Verification from "./components/After login/Charging Station/Verification";
import RejectedStation from "./components/After login/Charging Station/RejectedStation";
import StationApproved from "./components/After login/Charging Station/StationApproved";

/* Admin */
import AdminDashboard from "./components/After login/Admin/AdminDashboard";
import ManageStations from "./components/After login/Admin/ManageStations";
import ManageUsers from "./components/After login/Admin/ManageUsers";

/* Footer Pages */
import Guide from "./components/Footer link/Guide";
import ChargingTips from "./components/Footer link/ChargingTips";
import Contact from "./components/Footer link/Contact";
import TermsOfService from "./components/Footer link/TermsOfService";
import PrivacyPolicy from "./components/Footer link/PrivacyPolicy";
import HelpCenter from "./components/Footer link/HelpCenter";

/* Misc */
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Chatbot />

      <Routes>
        {/* ── Landing ── */}
        <Route path="/" element={<><Hero /><About /><FAQ /></>} />

        {/* ── Auth (public) ── */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />

        {/* ── Stations (logged in only) ── */}
        <Route path="/stations" element={
          <ProtectedRoute allowedRoles={["station_owner", "admin", "user"]}>
            <StationList />
          </ProtectedRoute>
        } />
        <Route path="/stations/:id" element={
          <ProtectedRoute allowedRoles={["station_owner", "admin", "user"]}>
            <StationDetail />
          </ProtectedRoute>
        } />

        {/* ── User (logged in only) ── */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/book-slot/:id" element={
          <ProtectedRoute>
            <BookSlot />
          </ProtectedRoute>
        } />

        {/* ── Station Management (station_owner + admin) ── */}
        <Route path="/add-station" element={
          <ProtectedRoute allowedRoles={["station_owner", "admin"]}>
            <AddStation />
          </ProtectedRoute>
        } />
        <Route path="/verification" element={
          <ProtectedRoute allowedRoles={["station_owner", "admin"]}>
            <Verification />
          </ProtectedRoute>
        } />
        <Route path="/station-rejected" element={
          <ProtectedRoute allowedRoles={["station_owner", "admin"]}>
            <RejectedStation />
          </ProtectedRoute>
        } />
        <Route path="/station-approved" element={
          <ProtectedRoute allowedRoles={["station_owner", "admin"]}>
            <StationApproved />
          </ProtectedRoute>
        } />

        {/* ── Admin only ── */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manage-stations" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageStations />
          </ProtectedRoute>
        } />
        <Route path="/manage-users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        } />
        
        {/* ── Footer Pages (public) ── */}
        <Route path="/guide" element={<Guide />} />
        <Route path="/charging-tips" element={<ChargingTips />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<HelpCenter />} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
