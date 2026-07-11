import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">How It Works</h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Understanding how SymptomSense processes your information to provide predictions.
        </p>
        
        {/* Three Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blue-100 z-0"></div>
          
          {[
            {
              step: 1,
              title: "Select Symptoms",
              desc: "Choose up to 20 symptoms you're currently experiencing from our clinical database.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            },
            {
              step: 2,
              title: "Run AI Models",
              desc: "Your data is securely processed through three distinct machine learning algorithms simultaneously.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            },
            {
              step: 3,
              title: "View Predictions",
              desc: "Review the top matched conditions, complete with probability scores and clinical descriptions.",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            }
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.icon}
                </svg>
              </div>
              <div className="absolute top-4 left-4 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Models Comparison Table */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Models Used</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 font-semibold text-gray-900">Model</th>
                  <th className="py-4 px-6 font-semibold text-gray-900">Strengths</th>
                  <th className="py-4 px-6 font-semibold text-gray-900">Weakness</th>
                  <th className="py-4 px-6 font-semibold text-gray-900">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm">Logistic Regression</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Interpretable, fast</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Linear assumptions</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">High-dim binary features</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-sm">KNN</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Flexible, no assumptions</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Slow on large data</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Well-separated clusters</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-sm">Decision Tree</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Rule-based, visual</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Prone to overfitting</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">Explainability</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
