import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <span className="text-xl" role="img" aria-label="stethoscope">🩺</span>
            <span className="text-lg font-bold text-gray-900">SymptomSense</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Find out what your symptoms might mean using our advanced machine learning models.
          </p>
        </div>
        
        <div className="flex space-x-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">How It Works</Link>
          <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">About</Link>
        </div>
        
        <div className="text-center md:text-right">
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-xs text-gray-500 max-w-3xl mx-auto px-4">
          ⚠️ Built for educational purposes. Not a medical device. Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </footer>
  );
}
