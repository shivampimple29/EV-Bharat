import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/landing_page/Hero";
import About from "./components/landing_page/About";
import FAQ from "./components/landing_page/FAQ";
import Guide from "./components/Footer link/Guide";
import ChargingTips from "./components/Footer link/ChargingTips";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import StationList from "./components/Stationlist/StationList";
import StationDetail from "./components/Stationlist/StationDetail";
import Contact from "./components/Footer link/Contact";
import Login from "./components/Login";
import Auth from "./components/Auth";
import UserProfile from "./components/After login/User/UserProfile";
import AddStation from "./components/After login/Charging Station/AddStation";
import AdminDashboard from "./components/After login/Admin/AdminDashboard";
import Verification from "./components/After login/Charging Station/Verification";
import ManageStations from "./components/After login/Admin/ManageStations";
import ManageUsers from "./components/After login/Admin/ManageUsers";

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* Navbar visible on all pages */}
        <Navbar />

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <main className="flex-1">
                <div className="max-w-full mx-auto px-0">
                  <Hero />
                  <About />
                  <FAQ />
                </div>
              </main>
            }
          />
          {/* login */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/stations" element={<StationList />} />
          <Route path="/station/:id" element={<StationDetail />} />

          {/* after login charging station */}
          <Route path="/add-station" element={<AddStation />} />
          <Route path="/verification" element={<Verification />} />

          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/admin-dashboard"
            element={
              <>
                <AdminDashboard />
              </>
            }
          />
          <Route path="/manage-stations" element={<ManageStations />} />
          <Route path="/manage-users" element={<ManageUsers />} />

          {/* Guide Page */}
          <Route path="/guide" element={<Guide />} />

          {/* Charging Tips Page */}
          <Route path="/charging-tips" element={<ChargingTips />} />

          <Route path="/contact" element={<Contact />} />
          {/* Add Station */}
          {/* <Route path="/add-station" element={<AddStation />} /> */}

          {/* Station Details */}
          {/* <Route path="/station/:id" element={<StationDetail />} /> */}

          {/* Login & Register */}
          {/* <Route path="/auth" element={<LoginRegister />} /> */}

          {/* 404 Page */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
