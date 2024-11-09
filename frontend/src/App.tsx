import React from "react";

// index.tsx
import "leaflet/dist/leaflet.css";
import TaxiMap from "./components/fragments/MapView";
import Navbar from "./components/fragments/Navbar";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="p-4 max-w-screen-xxl mx-auto">
        <TaxiMap />
      </div>
    </div>
  );
};

export default App;
