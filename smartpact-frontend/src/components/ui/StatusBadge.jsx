export default function StatusBadge({ status }) {
  // Determine colors based on the status string
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ACCEPTED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "SETTLED":
        return "bg-green-100 text-green-800 border-green-200";
      case "DISPUTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeStyle()}`}>
      {status.toUpperCase()}
    </span>
  );
}