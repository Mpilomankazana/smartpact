import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import CreatePact from "./pages/CreatePact"; // <-- We import your new form here!

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      
      <main className="max-w-6xl mx-auto mt-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* We swapped out the placeholder <div> for your actual component here: */}
          <Route path="/create" element={<CreatePact />} />
          
          <Route path="/ledger" element={<div className="p-8">Public Ledger Coming Soon...</div>} />
        </Routes>
      </main>
    </div>
  );
}