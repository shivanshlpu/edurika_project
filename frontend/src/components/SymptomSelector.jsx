import { useState, useMemo } from 'react';
import { extractSymptomsFromText } from '../utils/api';

export default function SymptomSelector({ availableSymptoms, onPredict, isLoading }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [nlText, setNlText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  // Filter symptoms based on search text
  const filteredSymptoms = useMemo(() => {
    if (!availableSymptoms) return [];
    if (!search.trim()) return availableSymptoms;
    
    const lowerSearch = search.toLowerCase();
    return availableSymptoms.filter(s => s.toLowerCase().includes(lowerSearch));
  }, [availableSymptoms, search]);

  const toggleSymptom = (symptom) => {
    if (selected.includes(symptom)) {
      setSelected(selected.filter(s => s !== symptom));
    } else {
      if (selected.length >= 20) {
        alert("You can select up to 20 symptoms maximum.");
        return;
      }
      setSelected([...selected, symptom]);
    }
  };

  const handleClear = () => {
    setSelected([]);
  };

  const handlePredict = () => {
    if (selected.length === 0) return;
    onPredict(selected);
  };

  const handleExtract = async () => {
    if (!nlText.trim()) return;
    
    setIsExtracting(true);
    setExtractError("");
    
    try {
      const response = await extractSymptomsFromText(nlText);
      const extractedSymptoms = response.data.symptoms;
      
      if (extractedSymptoms && extractedSymptoms.length > 0) {
        // Add new unique symptoms to selected, up to max 20
        const newSelected = [...selected];
        let addedCount = 0;
        
        for (const s of extractedSymptoms) {
          if (!newSelected.includes(s) && newSelected.length < 20) {
            newSelected.push(s);
            addedCount++;
          }
        }
        
        setSelected(newSelected);
        
        if (addedCount === 0 && extractedSymptoms.length > 0) {
          setExtractError("Symptoms were already selected or maximum reached.");
        }
      } else {
        setExtractError("No specific symptoms could be identified from your text. Please try describing differently or select manually.");
      }
    } catch (err) {
      console.error("Extraction error:", err);
      setExtractError(err.response?.data?.detail || "AI Symptom Extraction is currently unavailable. Please select manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const formatSymptom = (str) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Left side: Search & Select */}
      <div className="flex-grow p-6 md:border-r border-gray-100 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Symptoms</h2>
        <p className="text-sm text-gray-500 mb-4">Tell us how you're feeling, and our AI will automatically identify the symptoms.</p>
        
        <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Quick Try:</span>
            <button 
              onClick={() => setNlText("I have a severe headache, sensitivity to light, and I feel nauseous.")} 
              className="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Migraine
            </button>
            <button 
              onClick={() => setNlText("I've been experiencing stomach pain, vomiting, and diarrhea since last night after eating outside.")} 
              className="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Food Poisoning
            </button>
            <button 
              onClick={() => setNlText("I have a high fever, continuous sneezing, a runny nose, and I feel very fatigued.")} 
              className="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Flu/Cold
            </button>
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-3 text-sm"
            rows="3"
            placeholder="e.g., I have a terrible headache, my throat hurts, and I've been vomiting since yesterday..."
            value={nlText}
            onChange={(e) => setNlText(e.target.value)}
            disabled={isExtracting}
          ></textarea>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-red-500 w-full sm:max-w-[60%] leading-relaxed">{extractError}</span>
            <button
              onClick={handleExtract}
              disabled={isExtracting || !nlText.trim()}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                isExtracting || !nlText.trim()
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              {isExtracting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Extract Symptoms</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="h-px bg-gray-200 flex-grow"></div>
          <span className="px-3 text-sm text-gray-400 font-medium uppercase">Or select manually</span>
          <div className="h-px bg-gray-200 flex-grow"></div>
        </div>

        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
            placeholder="Search symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[300px] md:max-h-[400px]">
          {availableSymptoms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading symptoms...</div>
          ) : filteredSymptoms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No symptoms found matching "{search}"</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredSymptoms.map(symptom => {
                const isSelected = selected.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected 
                        ? "bg-blue-50 border border-blue-400 text-blue-700 shadow-sm" 
                        : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    {formatSymptom(symptom)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Right side: Selected Panel & Action */}
      <div className="w-full md:w-80 bg-gray-50 p-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Selected</h3>
          {selected.length > 0 && (
            <button 
              onClick={handleClear}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {selected.length} {selected.length === 1 ? 'symptom' : 'symptoms'}
          </span>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 mb-6 max-h-[200px] md:max-h-[none]">
          {selected.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm flex flex-col items-center">
              <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              No symptoms selected yet.
            </div>
          ) : (
            <div className="space-y-2">
              {selected.map(symptom => (
                <div key={symptom} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                  <span className="text-sm font-medium text-gray-700 truncate pr-2">
                    {formatSymptom(symptom)}
                  </span>
                  <button 
                    onClick={() => toggleSymptom(symptom)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                    aria-label={`Remove ${formatSymptom(symptom)}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-200 mt-auto">
          {selected.length === 0 && (
            <p className="text-xs text-amber-600 mb-2 text-center font-medium">
              Please select at least 1 symptom
            </p>
          )}
          <button
            onClick={handlePredict}
            disabled={selected.length === 0 || isLoading}
            className={`w-full py-3.5 rounded-full font-semibold text-white transition-all shadow-sm ${
              selected.length === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : isLoading
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Predict Disease"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
