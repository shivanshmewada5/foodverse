import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';
import ExportReportModal from '../components/ExportReportModal';
import {
  User,
  Settings,
  History,
  ShieldCheck,
  Save,
  Trash2,
  Key,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();
  
  // Profile Form States
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [age, setAge] = useState(user?.age || 28);
  const [gender, setGender] = useState(user?.gender || 'Not specified');
  const [heightCm, setHeightCm] = useState(user?.height_cm || 175);
  const [weightKg, setWeightKg] = useState(user?.weight_kg || 70);
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitness_goal || 'Balanced Nutrition & Longevity');
  const [calorieGoal, setCalorieGoal] = useState(user?.daily_calorie_goal || 2100);
  
  // Multi-select tags
  const [dietaryPrefs, setDietaryPrefs] = useState(user?.dietary_preferences || ['Mediterranean', 'High Protein']);
  const [allergies, setAllergies] = useState(user?.allergies || ['Peanuts']);
  
  // API Keys config
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('foodverse_gemini_key') || '');

  // History scans
  const [scans, setScans] = useState([]);
  const [scansLoading, setScansLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedScanForDossier, setSelectedScanForDossier] = useState(null);

  const availablePreferences = ["Mediterranean", "High Protein", "Low Sodium", "Keto", "Plant-Based", "Gluten-Free"];
  const availableAllergies = ["Peanuts", "Tree Nuts", "Dairy", "Shellfish", "Gluten", "Soy", "Eggs", "Sesame"];

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setAge(user.age || 28);
      setGender(user.gender || 'Not specified');
      setHeightCm(user.height_cm || 175);
      setWeightKg(user.weight_kg || 70);
      setFitnessGoal(user.fitness_goal || 'Balanced Nutrition & Longevity');
      setCalorieGoal(user.daily_calorie_goal || 2100);
      setDietaryPrefs(user.dietary_preferences || ['Mediterranean', 'High Protein']);
      setAllergies(user.allergies || ['Peanuts']);
    }
  }, [user]);

  const loadHistory = async () => {
    setScansLoading(true);
    try {
      const res = await historyAPI.getScans();
      setScans(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setScansLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: fullName,
        age: Number(age),
        gender,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        fitness_goal: fitnessGoal,
        daily_calorie_goal: Number(calorieGoal),
        dietary_preferences: dietaryPrefs,
        allergies: allergies,
      });
      localStorage.setItem('foodverse_gemini_key', geminiKey);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteScan = async (id) => {
    try {
      await historyAPI.deleteScan(id);
      setScans(scans.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Account & Biometric Settings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile & Preferences</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your personal metabolic targets, dietary rules, API keys, and inspection history.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedScanForDossier({
              title: `Comprehensive Profile Dossier: ${fullName}`,
              health_score: 93,
              overall_confidence: 0.98,
              status_label: "Active Nutritional Protocol",
              recommendations: [
                `Daily Calorie Target: ${calorieGoal} kcal`,
                `Dietary Style: ${dietaryPrefs.join(', ')}`,
                `Allergen Exclusions: ${allergies.join(', ') || 'None'}`
              ]
            });
            setExportModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Export Profile Dossier</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile configuration successfully synchronized with FoodVerse platform.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Biometrics & Settings */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-neutral-800 space-y-6">
          <form onSubmit={handleProfileSave} className="space-y-6">
            
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Biometrics & Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Email (Account ID)</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || "demo@foodverse.ai"}
                    className="w-full px-3 py-2 bg-neutral-900/50 border border-neutral-800/60 rounded-xl text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Not specified">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-neutral-800 pb-4 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nutritional Targets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Fitness Goal</label>
                  <input
                    type="text"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Daily Energy Target (kcal)</label>
                  <input
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">Dietary Protocols</label>
                <div className="flex flex-wrap gap-2">
                  {availablePreferences.map((pref) => {
                    const active = dietaryPrefs.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => toggleItem(dietaryPrefs, setDietaryPrefs, pref)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">Food Allergies & Intolerances</label>
                <div className="flex flex-wrap gap-2">
                  {availableAllergies.map((alg) => {
                    const active = allergies.includes(alg);
                    return (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => toggleItem(allergies, setAllergies, alg)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-red-500/15 border-red-500/40 text-red-300'
                            : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {alg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI API Keys Integration */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">External Multimodal AI Keys (Optional)</h3>
              </div>
              <p className="text-xs text-neutral-400">
                FoodVerse runs local computer vision and NLP algorithms automatically. If you wish to connect Google Gemini 2.5 Flash / Pro Vision, enter your API key here:
              </p>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>

          </form>
        </div>

        {/* Right Column (5 cols): Analysis History Log */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Analysis History ({scans.length})</h3>
            </div>
          </div>

          {scansLoading ? (
            <div className="py-8 text-center text-xs text-neutral-400">Loading history...</div>
          ) : scans.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No historical analyses yet. Scans will be logged here automatically.
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {scan.type}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-white truncate">{scan.title}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{scan.status_label || 'Completed'}</p>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedScanForDossier(scan);
                        setExportModalOpen(true);
                      }}
                      title="View Dossier"
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteScan(scan.id)}
                      title="Delete Entry"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={selectedScanForDossier}
        reportType="FoodVerse Intelligence Record"
      />

    </div>
  );
};

export default ProfileSettingsPage;
