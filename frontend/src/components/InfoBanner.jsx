export default function InfoBanner({ message, type = "warning", onRetry }) {
  const getColors = () => {
    switch (type) {
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "warning":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return "🚨";
      case "success":
        return "✅";
      case "warning":
      default:
        return "⚠️";
    }
  };

  return (
    <div className={`rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${getColors()}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">{getIcon()}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-1.5 text-sm font-semibold rounded-full bg-white shadow-sm border border-current hover:bg-opacity-90 transition-all shrink-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
