import { useState, useMemo } from "react"; 
import { useWallet } from "@solana/wallet-adapter-react";
import { LiFiWidget } from '@lifi/widget';

export default function CreatePact() {
  const { connected } = useWallet();
  
  // React state to track our form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    // For now, we will just log the data. 
    // Later, this is where we will call Lerato's Rust program!
    console.log("Submitting Pact:", { title, description, reward });
    alert(`Pact "${title}" is ready to be sent to the blockchain!`);
  };

  // Configuration for the LI.FI Widget
  const widgetConfig = useMemo(() => ({
    integrator: 'SmartPact', // Your team/app name
    containerStyle: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
    // We want the user to end up with SOL on Solana
    toChain: 1151111081099710, // Solana Mainnet ID (for devnet testing, LI.FI usually simulates)
    toToken: '11111111111111111111111111111111', // Native SOL address
    appearance: 'light', 
    variant: 'compact',
  }), []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create a New Pact</h1>
        <p className="text-gray-600 mt-2">Lock SOL in the escrow to hire a neighbour for a task.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Mow my front lawn"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
            <textarea 
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Explain exactly what needs to be done..."
            />
          </div>

          {/* Reward Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reward (in SOL)</label>
            <input 
              type="number" 
              step="0.01"
              required
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="0.1"
            />
          </div>

          {/* LI.FI Widget Placeholder - We will add this soon! */}
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-md text-sm text-purple-800 border-dashed">
            [LI.FI Widget Integration will go here for cross-chain funding]
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!connected}
            className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors ${
              connected ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {connected ? "Lock Reward & Create Pact" : "Connect Wallet to Create"}
          </button>
          
        </form>
      </div>
    </div>
  );
}