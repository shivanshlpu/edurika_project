import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export default function ModelComparisonChart({ results }) {
  const chartData = useMemo(() => {
    if (!results || !results.models) return [];
    
    // Collect all unique diseases returned by any model
    const diseaseSet = new Set();
    Object.values(results.models).forEach(preds => {
      preds.forEach(p => diseaseSet.add(p.disease));
    });
    
    const uniqueDiseases = Array.from(diseaseSet);
    
    // Format data for Recharts
    const data = uniqueDiseases.map(disease => {
      const item = { name: disease };
      
      // Get confidence for this disease from each model
      Object.entries(results.models).forEach(([modelName, preds]) => {
        const match = preds.find(p => p.disease === disease);
        // Multiply by 100 for percentage
        item[modelName] = match ? Math.round(match.confidence * 100) : 0;
      });
      
      return item;
    });
    
    // Sort by best performing model (first key)
    const firstModel = Object.keys(results.models)[0];
    if (firstModel) {
      data.sort((a, b) => b[firstModel] - a[firstModel]);
    }
    
    return data;
  }, [results]);

  if (!chartData.length) return null;

  const formatModelName = (name) => {
    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Custom colors matching the specification
  const colors = {
    logistic_regression: '#3B82F6', // blue-500
    knn: '#10B981',                 // emerald-500
    decision_tree: '#F59E0B'        // amber-500
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Model Confidence Comparison</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value) => [`${value}%`, 'Confidence']}
              labelStyle={{ fontWeight: 'semibold', color: '#111827', marginBottom: '8px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-gray-700 font-medium ml-2">{formatModelName(value)}</span>}
            />
            {Object.keys(results.models).map((modelName) => (
              <Bar 
                key={modelName} 
                dataKey={modelName} 
                fill={colors[modelName] || '#2563EB'} 
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
