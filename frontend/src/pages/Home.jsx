import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SymptomSelector from '../components/SymptomSelector';
import PredictionCard from '../components/PredictionCard';
import ModelComparisonChart from '../components/ModelComparisonChart';
import DiseaseDetailModal from '../components/DiseaseDetailModal';
import InfoBanner from '../components/InfoBanner';
import { usePrediction } from '../hooks/usePrediction';
import { getSymptoms } from '../utils/api';

export default function Home() {
  const [symptomsList, setSymptomsList] = useState([]);
  const [apiError, setApiError] = useState(null);
  const { loading, results, error, runPrediction } = usePrediction();
  
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await getSymptoms();
        setSymptomsList(response.data.symptoms || []);
        setApiError(null);
      } catch (err) {
        console.error("Failed to load symptoms", err);
        setApiError("Failed to connect to the prediction API. Ensure backend is running.");
      }
    };
    fetchSymptoms();
  }, []);

  const handlePredict = (selected) => {
    runPrediction(selected);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const openDiseaseModal = (diseaseName) => {
    setSelectedDisease(diseaseName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#F7F9FC] to-[#EFF6FF] py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              ⚕️ For educational purposes only. Not a substitute for medical advice.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Find out what your <br className="hidden md:block" />
              <span className="text-blue-600">symptoms might mean.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Select your symptoms below and our machine learning models will predict the most likely conditions.
            </p>
            <button 
              onClick={() => document.getElementById('symptom-selector')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Start Checking 
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </section>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="symptom-selector">
          {apiError && (
            <div className="mb-6">
              <InfoBanner message={apiError} type="error" />
            </div>
          )}
          
          <SymptomSelector 
            availableSymptoms={symptomsList} 
            onPredict={handlePredict}
            isLoading={loading}
          />
          
          {error && (
            <div className="mt-8">
              <InfoBanner 
                message={error} 
                type="error" 
                onRetry={() => document.getElementById('symptom-selector')?.scrollIntoView({ behavior: 'smooth' })} 
              />
            </div>
          )}
          
          {/* Results Section */}
          {results && !loading && (
            <div id="results-section" className="mt-16 animate-[fadeIn_0.5s_ease-out]">
              <div className="mb-8">
                <InfoBanner 
                  message="These results are predictions from machine learning models. Do not use this for self-diagnosis." 
                  type="warning" 
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction Results</h2>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Top consensus:</span> {results.top_prediction} 
                    <span className="mx-2 text-gray-300">|</span> 
                    <span className="text-blue-600 font-medium">{results.agreement}</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PredictionCard 
                  title="Logistic Regression" 
                  predictions={results.models.logistic_regression} 
                  modelColorClass={{ bg: 'bg-blue-50', text: 'text-blue-700', indicator: 'bg-blue-500' }}
                  onLearnMore={openDiseaseModal}
                />
                <PredictionCard 
                  title="K-Nearest Neighbors" 
                  predictions={results.models.knn} 
                  modelColorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-700', indicator: 'bg-emerald-500' }}
                  onLearnMore={openDiseaseModal}
                />
                <PredictionCard 
                  title="Decision Tree" 
                  predictions={results.models.decision_tree} 
                  modelColorClass={{ bg: 'bg-amber-50', text: 'text-amber-700', indicator: 'bg-amber-500' }}
                  onLearnMore={openDiseaseModal}
                />
              </div>
              
              <ModelComparisonChart results={results} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <DiseaseDetailModal 
        diseaseName={selectedDisease} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
