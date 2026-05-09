import { useParams } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import StatusBadge from "../components/ui/StatusBadge";

export default function PactDetail() {
  const { id } = useParams(); // Grabs the ID from the URL
  const { connected, publicKey } = useWallet();

  // Mock data for a single pact - In the future, we'll fetch this from Solana via ID
  const pact = {
    id: id,
    title: "Mow my front lawn",
    description: "I need the front lawn mowed and the edges trimmed. Must be done before Saturday. Please bring your own mower!",
    reward: 0.15,
    status: "ACCEPTED", // Try changing this to "OPEN" or "COMPLETED" to see the buttons change!
    creator: "4zMMC...x649",
    worker: "7u8Nm...p021",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{pact.title}</h1>
          <div className="flex gap-2 items-center">
            <StatusBadge status={pact.status} />
            <span className="text-gray-400 text-sm">ID: {pact.id}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Locked Reward</p>
          <p className="text-3xl font-bold text-green-600">{pact.reward} SOL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">Task Details</h2>
            <p className="text-gray-700 leading-relaxed">{pact.description}</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
            <h2 className="text-blue-900 font-semibold mb-2">Blockchain Escrow Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-800 text-sm">Funds are currently held in the Smart Contract PDA.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Contract Actions</h3>
            
            {!connected ? (
              <p className="text-gray-400 text-sm italic">Connect wallet to interact with this pact.</p>
            ) : (
              <div className="space-y-3">
                {/* Dynamic buttons based on status */}
                {pact.status === "OPEN" && (
                  <button className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-lg font-bold transition-all">
                    Accept Job
                  </button>
                )}
                
                {pact.status === "ACCEPTED" && (
                  <button className="w-full bg-purple-500 hover:bg-purple-400 py-3 rounded-lg font-bold transition-all">
                    Mark as Completed
                  </button>
                )}

                {pact.status === "COMPLETED" && (
                  <button className="w-full bg-blue-500 hover:bg-blue-400 py-3 rounded-lg font-bold transition-all">
                    Confirm & Release SOL
                  </button>
                )}

                <button className="w-full border border-gray-600 hover:bg-gray-800 py-3 rounded-lg text-sm transition-all text-gray-300">
                  Raise Dispute
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}