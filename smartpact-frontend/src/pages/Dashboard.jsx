import { useWallet } from "@solana/wallet-adapter-react";
import PactCard from "../components/ui/PactCard";

export default function Dashboard() {
  const { connected } = useWallet();

  // Temporary mock data until the Rust backend is connected
  const mockPacts = [
    { id: "1", title: "Mow my front lawn", reward: 0.15, status: "OPEN" },
    { id: "2", title: "Fix the leaky kitchen sink", reward: 0.5, status: "ACCEPTED" },
    { id: "3", title: "Walk my dog for 3 days", reward: 0.2, status: "COMPLETED" },
    { id: "4", title: "Help move couch to 2nd floor", reward: 0.1, status: "SETTLED" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Neighbourhood Pacts</h1>
          <p className="text-gray-600 mt-2">
            {connected ? "Browse available tasks or manage your active pacts." : "Connect your wallet to participate."}
          </p>
        </div>
      </div>

      {/* Grid to display the cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPacts.map((pact) => (
          <PactCard 
            key={pact.id}
            id={pact.id}
            title={pact.title}
            reward={pact.reward}
            status={pact.status}
          />
        ))}
      </div>
    </div>
  );
}