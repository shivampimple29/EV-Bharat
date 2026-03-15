import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

/* Station Management */
import AddStation from "./components/After login/Charging Station/AddStation";
import Verification from "./components/After login/Charging Station/Verification";

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
      <Navbar />
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <main className="flex-1">
              <Hero />
              <About />
              <FAQ />
              
            </main>
          }
        />
        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        {/* Stations */}
        <Route path="/stations" element={<StationList />} />
        <Route path="/station/:id" element={<StationDetail />} />{" "}
        {/* User */}
        <Route path="/profile" element={<UserProfile />} />
        {/* Station Management */}
        <Route path="/add-station" element={<AddStation />} />
        <Route path="/verification" element={<Verification />} />
        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-stations" element={<ManageStations />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        {/* Footer Pages */}
        <Route path="/guide" element={<Guide />} />
        <Route path="/charging-tips" element={<ChargingTips />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/HelpCenter" element={<HelpCenter />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
