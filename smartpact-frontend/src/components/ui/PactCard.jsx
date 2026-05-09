import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function PactCard({ id, title, reward, status }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <StatusBadge status={status} />
      </div>
      
      <div className="flex justify-between items-end mt-6">
        <div>
          <p className="text-sm text-gray-500">Reward</p>
          <p className="text-xl font-bold text-green-600">{reward} SOL</p>
        </div>
        
        {/* Link to the specific Pact Detail page */}
        <Link 
          to={`/pact/${id}`}
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}