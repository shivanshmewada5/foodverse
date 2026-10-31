import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { nutritionAPI } from '../services/api';
import MetricCard from '../components/MetricCard';
import ExportReportModal from '../components/ExportReportModal';
import {
  Sparkles,
  Activity,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  ChevronRight,
  TrendingUp,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const NutritionAnalysisPage = () => {
  const location = useLocation();
  const initialFoodName = location.state?.foodName || "Mediterranean Quinoa Salad Bowl";
  const initialImageUrl = location.state?.imageUrl || null;

  const [foodQuery, setFoodQuery] = useState(initialFoodName);
  const [portionGrams, setPortionGrams] = useState(380);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const popularPresetFoods = [
    { name: "Mediterranean Quinoa Salad Bowl", grams: 380 },
    { name: "Pan-Seared Atlantic Salmon & Asparagus", grams: 320 },
    { name: "Artisan Avocado Toast with Poached Egg", grams: 240 },
    { name: "Italian Penne Pasta all'Arrabbiata", grams: 350 },
    { name: "Fresh Berry & Greek Yogurt Acai Parfait", grams: 260 },
    { name: "Chicken Tikka Masala with Basmati Rice", grams: 420 },
  ];

  const fetchNutrition = async (nameToFetch, grams) => {
    setLoading(true);
    setError('');
    try {
      const res = await nutritionAPI.analyzeNutrition(
        nameToFetch || foodQuery,
        grams || portionGrams,
        initialImageUrl
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to compute nutritional values. Please verify dish name.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition(initialFoodName, portionGrams);
  }, [initialFoodName]);

  // Macro distribution for Pie Chart
  const pieData = result ? [
    { name: 'Protein (g)', value: result.macros.protein.amount, color: '#10b981' },
    { name: 'Carbs (g)', value: result.macros.carbs.amount, color: '#3b82f6' },
    { name: 'Fats (g)', value: result.macros.fats.amount, color: '#f59e0b' },
  ] : [];

  // Macro daily value bars
  const macroBarData = result ? [
    { name: 'Protein', amount: result.macros.protein.amount, daily: result.macros.protein.daily_value_percentage, fill: '#10b981' },
    { name: 'Carbs', amount: result.macros.carbs.amount, daily: result.macros.carbs.daily_value_percentage, fill: '#3b82f6' },
    { name: 'Fats', amount: result.macros.fats.amount, daily: result.macros.fats.daily_value_percentage, fill: '#f59e0b' },
    { name: 'Fiber', amount: result.macros.fiber.amount, daily: result.macros.fiber.daily_value_percentage, fill: '#8b5cf6' },
    { name: 'Sugar', amount: result.macros.sugar.amount, daily: result.macros.sugar.daily_value_percentage, fill: '#ec4899' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>AI Nutrition & Health Score Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Nutrition Analysis</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Automated calorie estimation, macronutrient decomposition, micronutrient profiling, and health scoring.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export Nutrition Report</span>
          </button>
        )}
      </div>

      {/* Search / Preset Selector Bar */}
      <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="Enter dish name (e.g. Grilled Salmon, Quinoa Bowl, Chicken Curry)..."
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="number"
              value={portionGrams}
              onChange={(e) => setPortionGrams(Number(e.target.value))}
              placeholder="Grams"
              className="w-24 px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white text-center focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs text-neutral-400">grams</span>
            <button
              onClick={() => fetchNutrition(foodQuery, portionGrams)}
              disabled={loading || !foodQuery.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Recalculate'}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-neutral-400 mr-1">Quick Presets:</span>
          {popularPresetFoods.map((pf, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setFoodQuery(pf.name);
                setPortionGrams(pf.grams);
                fetchNutrition(pf.name, pf.grams);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-emerald-500/40 transition-colors"
            >
              {pf.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Main Results Dashboard */}
      {result && (
        <div className="space-y-8">
          
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Calories Card */}
            <MetricCard
              title="Energy Density"
              value={result.calories_kcal}
              unit="kcal"
              subtitle={result.portion_size_description}
              icon={Flame}
              color="rose"
            />

            {/* Health Score Card */}
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 glow-emerald flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Health Score</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-black bg-emerald-500 text-neutral-950">
                  Grade {result.health_grade}
                </span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-emerald-400">{result.health_score}</span>
                <span className="text-sm font-semibold text-neutral-400"> / 100</span>
              </div>
              <p className="text-[11px] text-neutral-400">Nutritional Density & Glycemic Index</p>
            </div>

            {/* Protein Card */}
            <MetricCard
              title="Protein Content"
              value={result.macros.protein.amount}
              unit="g"
              subtitle={`${result.macros.protein.daily_value_percentage}% Daily Target`}
              icon={Activity}
              color="emerald"
            />

            {/* Dietary Fiber Card */}
            <MetricCard
              title="Dietary Fiber"
              value={result.macros.fiber.amount}
              unit="g"
              subtitle={`${result.macros.fiber.daily_value_percentage}% Daily Target`}
              icon={Scale}
              color="purple"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Macronutrient Distribution Chart (Bar) */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Macronutrient Profile (% of Daily Recommended Value)</h3>
                  <p className="text-xs text-neutral-400">Estimated based on a 2,000 kcal standard reference diet</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  USDA Reference
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={macroBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" stroke="#525252" domain={[0, 100]} unit="%" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#525252" fontSize={11} width={65} />
                    <Tooltip
                      formatter={(val, name, props) => [`${props.payload.amount}g (${val}%)`, props.payload.name]}
                      contentStyle={{ backgroundColor: '#131b17', borderColor: '#23382c', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    />
                    <Bar dataKey="daily" radius={[0, 8, 8, 0]}>
                      {macroBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2 text-center text-xs border-t border-neutral-800">
                {Object.values(result.macros).map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-neutral-900/60">
                    <span className="text-[10px] text-neutral-400 block">{m.name.split(' ')[0]}</span>
                    <strong className="text-white mt-0.5 block">{m.amount}{m.unit}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Macro Ratio Donut Chart */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Macro Ratio (Protein vs Carbs vs Fat)</h3>
                <p className="text-xs text-neutral-400">Caloric distribution among major nutrients</p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#131b17', borderColor: '#23382c', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400">
                Healthy balanced meals maintain ~30% protein, ~45% low-GI carbs, and ~25% unsaturated fats.
              </div>
            </div>

          </div>

          {/* Health Factors & Suitability Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Health Factors Impact */}
            <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Health Factors & Impact Breakdown</h3>
              <div className="space-y-2.5">
                {result.health_factors.map((hf, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                      hf.impact === 'positive'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}
                  >
                    {hf.impact === 'positive' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block mb-0.5">{hf.factor}</span>
                      <p className="text-[11px] leading-relaxed opacity-90">{hf.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Suitability */}
            <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dietary Suitability Protocol</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(result.dietary_suitability).map(([diet, suitable]) => (
                  <div
                    key={diet}
                    className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between"
                  >
                    <span className="text-xs text-neutral-300 capitalize">{diet.replace('_', ' ')}</span>
                    {suitable ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Suitable</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-500">
                        Not Compatible
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Actionable Recommendations */}
              <div className="pt-2">
                <span className="text-xs font-bold text-neutral-300 block mb-2">AI Nutritionist Recommendations:</span>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {result.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Mandatory Safety & Portion Size Disclaimer */}
          <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-neutral-400 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>IMPORTANT DISCLAIMER:</strong> {result.disclaimer}
            </p>
          </div>

        </div>
      )}

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={result}
        reportType="Nutritional Intelligence Dossier"
      />

    </div>
  );
};

export default NutritionAnalysisPage;
