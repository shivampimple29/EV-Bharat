import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/landing_page/Hero";
import About from "./components/landing_page/About";
import FAQ from "./components/landing_page/FAQ";
import Guide from "./components/Guide";
import ChargingTips from "./components/ChargingTips";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import StationList from "./components/Stationlist/StationList";
import StationDetail from "./components/Stationlist/StationDetail";

function App() {
  return (
    //     <div className="min-h-screen flex flex-col">
    //       <Navbar />

    //       <main className="flex-1">
    //         <div className="max-w-full mx-auto px-0">
    //           <Hero />
    //           <About />
    //           <FAQ />
    //         </div>
    //       </main>
    //       <ChargingTips/>
    // <Guide/>

    //       <Footer />
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
                <StationList/>
                <About />
                <FAQ />
              </div>
            </main>
          }
        />
         <Route path="/station/:id" element={<StationDetail/>} />

        {/* Guide Page */}
        <Route path="/guide" element={<Guide />} />

        {/* Charging Tips Page */}
        <Route path="/charging-tips" element={<ChargingTips />} />

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
