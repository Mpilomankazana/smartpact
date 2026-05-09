import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <div>
        {/* The Link component is from React Router, preventing full page reloads */}
        <Link to="/" className="text-xl font-bold tracking-wider text-green-400">
          SMARTPACT
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-green-300 transition-colors">Dashboard</Link>
        <Link to="/create" className="hover:text-green-300 transition-colors">Create Pact</Link>
        <Link to="/ledger" className="hover:text-green-300 transition-colors">Ledger</Link>
        
        {/* This is the magic button from Solana that handles Phantom/Solflare connections */}
        <WalletMultiButton className="bg-green-600 hover:bg-green-500 rounded-md" />
      </div>
    </nav>
  );
}