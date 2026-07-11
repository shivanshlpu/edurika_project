import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Dummy data for Kaggle Dataset (since it's a perfectly balanced dataset of 41 diseases * 120 samples = 4920)
const datasetDistribution = [
  { name: 'Fungal infection', value: 120 },
  { name: 'Allergy', value: 120 },
  { name: 'GERD', value: 120 },
  { name: 'Chronic cholestasis', value: 120 },
  { name: 'Drug Reaction', value: 120 },
  { name: 'Peptic ulcer disease', value: 120 },
  { name: 'AIDS', value: 120 },
  { name: 'Diabetes', value: 120 },
  { name: 'Gastroenteritis', value: 120 },
  { name: 'Bronchial Asthma', value: 120 },
  { name: 'Hypertension', value: 120 },
  { name: 'Migraine', value: 120 },
  { name: 'Cervical spondylosis', value: 120 },
  { name: 'Paralysis (brain hemorrhage)', value: 120 },
  { name: 'Jaundice', value: 120 },
  { name: 'Malaria', value: 120 },
  { name: 'Chicken pox', value: 120 },
  { name: 'Dengue', value: 120 },
  { name: 'Typhoid', value: 120 },
  { name: 'hepatitis A', value: 120 },
  { name: 'Hepatitis B', value: 120 },
  { name: 'Hepatitis C', value: 120 },
  { name: 'Hepatitis D', value: 120 },
  { name: 'Hepatitis E', value: 120 },
  { name: 'Alcoholic hepatitis', value: 120 },
  { name: 'Tuberculosis', value: 120 },
  { name: 'Common Cold', value: 120 },
  { name: 'Pneumonia', value: 120 },
  { name: 'Dimorphic hemorrhoids(piles)', value: 120 },
  { name: 'Heart attack', value: 120 },
  { name: 'Varicose veins', value: 120 },
  { name: 'Hypothyroidism', value: 120 },
  { name: 'Hyperthyroidism', value: 120 },
  { name: 'Hypoglycemia', value: 120 },
  { name: 'Osteoarthristis', value: 120 },
  { name: 'Arthritis', value: 120 },
  { name: '(vertigo) Paroymsal  Positional Vertigo', value: 120 },
  { name: 'Acne', value: 120 },
  { name: 'Urinary tract infection', value: 120 },
  { name: 'Psoriasis', value: 120 },
  { name: 'Impetigo', value: 120 }
];

// Top 10 most common symptoms across the dataset
const topSymptoms = [
  { name: 'Fatigue', count: 1932 },
  { name: 'Vomiting', count: 1914 },
  { name: 'High fever', count: 1362 },
  { name: 'Loss of appetite', count: 1152 },
  { name: 'Nausea', count: 1146 },
  { name: 'Headache', count: 1134 },
  { name: 'Abdominal pain', count: 1032 },
  { name: 'Yellowish skin', count: 912 },
  { name: 'Yellowing of eyes', count: 816 },
  { name: 'Chills', count: 798 }
];

// Actual metrics for the trained models on the Kaggle Dataset
const modelPerformance = [
  {
    name: 'Logistic Regression',
    Accuracy: 100,
    Precision: 100,
    Recall: 100,
  },
  {
    name: 'K-Nearest Neighbors',
    Accuracy: 100,
    Precision: 100,
    Recall: 100,
  },
  {
    name: 'Decision Tree',
    Accuracy: 100,
    Precision: 100,
    Recall: 100,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Performance() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Machine Learning Architecture & Performance</h1>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto">
              A comprehensive technical breakdown of the SymptomSense ML pipeline, detailing dataset processing, feature selection, model architecture, and final benchmark evaluation.
            </p>
          </div>

          {/* Section 1: The ML Pipeline */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center border-b pb-3">
              <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 text-sm">01</span> 
              End-to-End Pipeline
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-between text-center gap-4 md:gap-2">
                <div className="flex-1 w-full md:w-auto px-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2 shadow-sm font-semibold text-slate-700">1. Data Collection</div>
                  <p className="text-xs text-slate-500">Kaggle Disease-Symptom Dataset (4920 records)</p>
                </div>
                <div className="text-slate-300 transform rotate-90 md:rotate-0">➔</div>
                <div className="flex-1 w-full md:w-auto px-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2 shadow-sm font-semibold text-slate-700">2. Preprocessing</div>
                  <p className="text-xs text-slate-500">Cleaning, String formatting, Missing value handling</p>
                </div>
                <div className="text-slate-300 transform rotate-90 md:rotate-0">➔</div>
                <div className="flex-1 w-full md:w-auto px-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2 shadow-sm font-semibold text-slate-700">3. Feature Engineering</div>
                  <p className="text-xs text-slate-500">MultiLabelBinarizer (131 Boolean Features)</p>
                </div>
                <div className="text-slate-300 transform rotate-90 md:rotate-0">➔</div>
                <div className="flex-1 w-full md:w-auto px-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2 shadow-sm font-semibold text-blue-700">4. Model Training</div>
                  <p className="text-xs text-slate-500">LogReg, KNN, Decision Tree (80/20 Split)</p>
                </div>
                <div className="text-slate-300 transform rotate-90 md:rotate-0">➔</div>
                <div className="flex-1 w-full md:w-auto px-2">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2 shadow-sm font-semibold text-green-700">5. Evaluation</div>
                  <p className="text-xs text-slate-500">Accuracy, Precision, Recall Metrics</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Dataset & Feature Selection */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center border-b pb-3">
              <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 text-sm">02</span> 
              Dataset Analysis & Feature Selection
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Class Distribution</h3>
                <p className="text-sm text-slate-500 mb-4">Perfectly balanced dataset ensuring no model bias towards a majority class (120 samples per disease).</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={datasetDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" paddingAngle={1} dataKey="value">
                        {datasetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} samples`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Feature Importance (Top Symptoms)</h3>
                <p className="text-sm text-slate-500 mb-4">Distribution of the most frequently occurring boolean feature flags across all records.</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSymptoms} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-2">Feature Selection Strategy</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Rather than performing dimensionality reduction (like PCA) which obscures interpretability, we utilized a <strong>MultiLabelBinarizer</strong> to convert raw string arrays into a sparse binary matrix of exactly <strong>131 features</strong>. 
                Because medical diagnosis relies on specific symptom combinations, retaining all 131 boolean flags ensures no critical data loss. 
                Features with zero variance across the dataset were implicitly ignored by the algorithms during training.
              </p>
            </div>
          </section>

          {/* Section 3: Model Architecture & Algorithms */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center border-b pb-3">
              <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 text-sm">03</span> 
              Model Architecture & Training
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Decision Tree */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xl mb-4">🌳</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Decision Tree Classifier</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Uses a tree structure to split data based on feature thresholds.
                </p>
                <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-900 border border-amber-100">
                  <strong>Impurity Reduction:</strong> The algorithm calculates <strong>Gini Impurity</strong> at each node. It selects the symptom feature that provides the highest Information Gain, repeatedly splitting the data until leaf nodes contain exactly one disease class (Impurity = 0). This results in highly interpretable, deterministic decision boundaries.
                </div>
              </div>

              {/* Logistic Regression */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl mb-4">📈</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Logistic Regression</h3>
                <p className="text-sm text-slate-600 mb-4">
                  A linear model adapted for multiclass classification using a One-vs-Rest (OvR) scheme.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900 border border-blue-100">
                  <strong>Probabilistic Output:</strong> It calculates a weighted sum of the input features and applies a sigmoid/softmax function. It is excellent for showing <em>confidence probabilities</em> across multiple potential diseases rather than a hard classification.
                </div>
              </div>

              {/* KNN */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl mb-4">📍</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">K-Nearest Neighbors</h3>
                <p className="text-sm text-slate-600 mb-4">
                  A non-parametric, distance-based algorithm. We used K=5.
                </p>
                <div className="bg-green-50 p-3 rounded-lg text-sm text-green-900 border border-green-100">
                  <strong>Vector Proximity:</strong> It plots the user's 131-dimension symptom vector and calculates the Euclidean distance to all training points. It classifies based on the majority vote of the 5 closest historical patient records.
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Benchmarks */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center border-b pb-3">
              <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 text-sm">04</span> 
              Performance Benchmarks
            </h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-center mb-8">
                <img src="/performance_graph.png" alt="Model Performance Graph" className="max-w-full h-auto rounded-xl border border-slate-200 shadow-sm" />
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Conclusion & The 100% Accuracy Phenomenon</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  During testing (using a strict 80/20 train-test split), all models achieved <strong>100% validation metrics</strong>. 
                  In real-world medical data, 100% accuracy implies overfitting. However, the Kaggle Disease-Symptom dataset is synthetically deterministic — meaning every disease maps to a highly specific, unique binary signature of symptoms without noise. 
                  <br/><br/>
                  Because the data is perfectly <em>linearly separable</em>, the Decision Tree effortlessly achieved a <strong>Gini Impurity of 0.0</strong> at its leaf nodes, and Logistic Regression separated the classes without overlap. To handle real-world uncertainty (where a user might only input 2 symptoms instead of the full mathematical signature), we engineered an <strong>Ensemble Voting System</strong> in the application to highlight probabilistic confidence rather than absolute certainty.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
