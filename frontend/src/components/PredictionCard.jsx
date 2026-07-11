export default function PredictionCard({ title, predictions, modelColorClass, onLearnMore }) {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className={`px-5 py-3 border-b border-gray-100 flex items-center gap-2 ${modelColorClass.bg}`}>
        <div className={`w-3 h-3 rounded-full ${modelColorClass.indicator}`}></div>
        <h3 className={`font-semibold ${modelColorClass.text}`}>{title}</h3>
      </div>
      
      <div className="p-5 flex-grow">
        <div className="space-y-6">
          {predictions.map((pred, idx) => {
            const conf = Math.round(pred.confidence * 100);
            
            // Determine progress bar color based on confidence
            let barColor = "bg-red-400";
            if (conf >= 70) barColor = "bg-emerald-400";
            else if (conf >= 40) barColor = "bg-amber-400";
            
            return (
              <div key={idx} className="relative">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}.</span>
                    <span className="font-semibold text-gray-900">{pred.disease}</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-gray-700">{conf}%</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className={`${barColor} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${conf}%` }}></div>
                </div>
                
                <button 
                  onClick={() => onLearnMore(pred.disease)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  Learn more 
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
