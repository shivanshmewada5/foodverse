import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mealPlanAPI } from '../services/api';
import ExportReportModal from '../components/ExportReportModal';
import MetricCard from '../components/MetricCard';
import {
  Calendar,
  Sparkles,
  Flame,
  Activity,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Coffee,
  Utensils,
  Moon,
  Apple,
  Clock,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const MealPlannerPage = () => {
  const { user } = useAuth();
  
  // Customization Form Parameters
  const [age, setAge] = useState(user?.age || 28);
  const [dietaryPref, setDietaryPref] = useState(user?.dietary_preferences?.[0] || "Balanced / Mediterranean");
  const [selectedAllergies, setSelectedAllergies] = useState(user?.allergies || ["Peanuts"]);
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitness_goal || "Lean Muscle & Longevity");
  const [calorieTarget, setCalorieTarget] = useState(user?.daily_calorie_goal || 2100);

  // Meal Plan State
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const allergyOptions = ["Peanuts", "Tree Nuts", "Dairy", "Shellfish", "Gluten", "Soy", "Eggs", "Sesame"];
  const dietOptions = [
    "Balanced / Mediterranean",
    "High Protein / Athletic",
    "Ketogenic / Low-Carb",
    "Plant-Based / Vegan",
    "Paleo Clean Protocol"
  ];

  const handleAllergyToggle = (alg) => {
    if (selectedAllergies.includes(alg)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== alg));
    } else {
      setSelectedAllergies([...selectedAllergies, alg]);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await mealPlanAPI.generatePlan({
        age: Number(age),
        dietary_preference: dietaryPref,
        allergies: selectedAllergies,
        fitness_goal: fitnessGoal,
        daily_calorie_target: Number(calorieTarget),
        days_count: 7
      });
      setPlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const res = await mealPlanAPI.getLatest();
        if (res.data) {
          setPlan(res.data);
        } else {
          await generatePlan();
        }
      } catch (e) {
        await generatePlan();
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const currentDay = plan?.days?.[activeDayIndex];

  // 7-day BarChart data
  const weekChartData = plan?.days?.map(d => ({
    day: d.day.substring(0, 3),
    calories: d.daily_calories,
    protein: d.daily_protein_g,
    target: plan.target_calories_daily
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Nutritional Schedule & Allergen Guard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Personalized AI Meal Planner</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Dynamic 7-day nutritional schedules tailored to metabolic targets, allergies, and longevity goals.
          </p>
        </div>

        {plan && (
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export Weekly Meal Plan</span>
          </button>
        )}
      </div>

      {/* Profile Parameters Control Panel */}
      <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Metabolic Profile & Guardrail Config</h2>
          <span className="text-[10px] text-emerald-400 font-mono">Real-Time Adaptability</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Dietary Protocol</label>
            <select
              value={dietaryPref}
              onChange={(e) => setDietaryPref(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {dietOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Fitness & Longevity Goal</label>
            <input
              type="text"
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              placeholder="e.g. Lean Muscle, Fat Loss, Low GI"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Daily Calorie Target (kcal)</label>
            <input
              type="number"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

        {/* Allergen Filters */}
        <div>
          <span className="block text-xs font-semibold text-neutral-300 mb-2">
            Exclude Anaphylactic Allergens & Intolerances:
          </span>
          <div className="flex flex-wrap gap-2">
            {allergyOptions.map((alg) => {
              const active = selectedAllergies.includes(alg);
              return (
                <button
                  key={alg}
                  type="button"
                  onClick={() => handleAllergyToggle(alg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
                    active
                      ? 'bg-red-500/15 border-red-500/40 text-red-300'
                      : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {active && <ShieldAlert className="w-3 h-3 text-red-400" />}
                  <span>{alg}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={generatePlan}
            disabled={loading}
            className="py-2.5 px-6 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-xs flex items-center space-x-2 shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Re-optimizing Weekly Matrix...' : 'Generate Personalized 7-Day Plan'}</span>
          </button>
        </div>
      </div>

      {/* Plan Dashboard */}
      {plan && (
        <div className="space-y-8">
          
          {/* Top Weekly Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Target Daily Energy"
              value={plan.target_calories_daily}
              unit="kcal"
              subtitle={plan.dietary_preference}
              icon={Flame}
              color="emerald"
            />
            <MetricCard
              title="Daily Protein Avg"
              value={plan.weekly_averages.protein_g}
              unit="g/day"
              subtitle="Optimized for protein synthesis"
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Allergen Exclusions"
              value={selectedAllergies.length}
              unit="rules active"
              subtitle="Zero cross-contamination"
              icon={ShieldAlert}
              color="rose"
            />
            <MetricCard
              title="Weekly Adherence"
              value="100%"
              subtitle="All 7 days structured"
              icon={CheckCircle2}
              color="purple"
            />
          </div>

          {/* 7-Day Day Selector Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {plan.days.map((dayPlan, index) => {
              const isActive = activeDayIndex === index;
              return (
                <button
                  key={dayPlan.day}
                  onClick={() => setActiveDayIndex(index)}
                  className={`px-4 py-3 rounded-2xl border text-left flex-shrink-0 min-w-[120px] transition-all ${
                    isActive
                      ? 'bg-neutral-900 border-emerald-500 text-white glow-emerald'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{dayPlan.day}</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-1">{dayPlan.daily_calories} kcal</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{dayPlan.daily_protein_g}g Protein</div>
                </button>
              );
            })}
          </div>

          {/* Active Day Meal Schedule */}
          {currentDay && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentDay.day} Culinary Schedule</h3>
                  <p className="text-xs text-neutral-400">{currentDay.health_focus_note}</p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-neutral-400">Total: <strong className="text-white">{currentDay.daily_calories} kcal</strong></span>
                  <span className="text-neutral-400">P: <strong className="text-emerald-400">{currentDay.daily_protein_g}g</strong></span>
                  <span className="text-neutral-400">C: <strong className="text-blue-400">{currentDay.daily_carbs_g}g</strong></span>
                  <span className="text-neutral-400">F: <strong className="text-amber-400">{currentDay.daily_fats_g}g</strong></span>
                </div>
              </div>

              {/* 4 Meals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Breakfast */}
                <div className="glass-card rounded-2xl p-5 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase text-amber-400">Breakfast</span>
                    </div>
                    <span className="text-xs font-bold text-white">{currentDay.breakfast.calories} kcal</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{currentDay.breakfast.name}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{currentDay.breakfast.description}</p>
                  
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{currentDay.breakfast.protein_g}g Prot • {currentDay.breakfast.carbs_g}g Carb • {currentDay.breakfast.fats_g}g Fat</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{currentDay.breakfast.prep_time_minutes} min prep</span>
                    </span>
                  </div>
                </div>

                {/* Lunch */}
                <div className="glass-card rounded-2xl p-5 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase text-emerald-400">Lunch</span>
                    </div>
                    <span className="text-xs font-bold text-white">{currentDay.lunch.calories} kcal</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{currentDay.lunch.name}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{currentDay.lunch.description}</p>
                  
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{currentDay.lunch.protein_g}g Prot • {currentDay.lunch.carbs_g}g Carb • {currentDay.lunch.fats_g}g Fat</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{currentDay.lunch.prep_time_minutes} min prep</span>
                    </span>
                  </div>
                </div>

                {/* Dinner */}
                <div className="glass-card rounded-2xl p-5 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Moon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase text-blue-400">Dinner</span>
                    </div>
                    <span className="text-xs font-bold text-white">{currentDay.dinner.calories} kcal</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{currentDay.dinner.name}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{currentDay.dinner.description}</p>
                  
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{currentDay.dinner.protein_g}g Prot • {currentDay.dinner.carbs_g}g Carb • {currentDay.dinner.fats_g}g Fat</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{currentDay.dinner.prep_time_minutes} min prep</span>
                    </span>
                  </div>
                </div>

                {/* Healthy Snack */}
                <div className="glass-card rounded-2xl p-5 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Apple className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase text-purple-400">Healthy Snack</span>
                    </div>
                    <span className="text-xs font-bold text-white">{currentDay.snack.calories} kcal</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{currentDay.snack.name}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{currentDay.snack.description}</p>
                  
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{currentDay.snack.protein_g}g Prot • {currentDay.snack.carbs_g}g Carb • {currentDay.snack.fats_g}g Fat</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{currentDay.snack.prep_time_minutes} min prep</span>
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Weekly Calorie Bar Chart */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">7-Day Energy Consistency Target</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#525252" fontSize={11} />
                  <YAxis domain={[1500, 2600]} stroke="#525252" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131b17', borderColor: '#23382c', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} name="Daily Calories (kcal)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allergen & Safety Disclaimer */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              {plan.safety_disclaimer}
            </p>
          </div>

        </div>
      )}

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={plan}
        reportType="Personalized 7-Day Meal Protocol"
      />

    </div>
  );
};

export default MealPlannerPage;
