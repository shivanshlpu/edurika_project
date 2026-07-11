import { useState, useEffect } from 'react';
import { getDiseaseInfo } from '../utils/api';

function SkeletonLine({ width = '100%' }) {
  return (
    <div
      className="h-4 bg-gray-200 rounded-md animate-pulse"
      style={{ width }}
    />
  );
}

function SkeletonBlock() {
  return (
    <div className="space-y-3">
      <SkeletonLine width="85%" />
      <SkeletonLine width="70%" />
      <SkeletonLine width="90%" />
    </div>
  );
}

export default function DiseaseDetailModal({ diseaseName, isOpen, onClose }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !diseaseName) {
      setInfo(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDiseaseInfo(diseaseName);
        if (!cancelled) {
          setInfo(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch disease info:", err);
        if (!cancelled) {
          setError("Could not load disease details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInfo();
    return () => { cancelled = true; };
  }, [isOpen, diseaseName]);

  if (!isOpen || !diseaseName) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl transform transition-all flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto pr-2 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{diseaseName}</h2>
            {info?.source && (
              <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                info.source === 'gemini'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {info.source === 'gemini' ? '✨ AI Generated' : 'Offline Data'}
              </span>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <SkeletonBlock />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-7 w-20 bg-gray-200 rounded-full" />
                ))}
              </div>
              <SkeletonBlock />
              <SkeletonBlock />
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loaded content */}
          {info && !loading && (
            <>
              {/* Description */}
              <div className="prose prose-sm sm:prose-base text-gray-600">
                <p>{info.description}</p>
              </div>

              {/* Common Symptoms */}
              {info.commonSymptoms?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Commonly Associated Symptoms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {info.commonSymptoms.map(sym => (
                      <span key={sym} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                        {sym.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Precautions */}
              {info.precautions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Precautions & Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {info.precautions.map((precaution, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Tests */}
              {info.tests?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    🔬 Recommended Diagnostic Tests
                  </h3>
                  <ul className="space-y-2">
                    {info.tests.map((test, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warning Signs */}
              {info.warningSigns?.length > 0 && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-lg">🚨</span> Emergency Warning Signs
                  </h3>
                  <ul className="space-y-2">
                    {info.warningSigns.map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-red-700">
                        <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer disclaimer */}
              <div className="mt-2 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
                  <span className="text-base">⚕️</span>
                  This information is for educational purposes only. Always consult a qualified healthcare professional for diagnosis and treatment.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
