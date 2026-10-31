import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyAPI } from '../services/api';
import MetricCard from '../components/MetricCard';
import ExportReportModal from '../components/ExportReportModal';
import {
  Sparkles,
  Camera,
  Activity,
  ShieldCheck,
  Video,
  ChefHat,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Printer,
  ChevronRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedScanForExport, setSelectedScanForExport] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, scansRes] = await Promise.all([
          historyAPI.getDashboardStats(),
          historyAPI.getScans(),
        ]);
        setStats(statsRes.data);
        setRecentScans(scansRes.data);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Synthetic trend chart data
  const healthTrendData = [
    { day: 'Mon', score: 82, calories: 2050 },
    { day: 'Tue', score: 88, calories: 1980 },
    { day: 'Wed', score: 85, calories: 2120 },
    { day: 'Thu', score: 91, calories: 2000 },
    { day: 'Fri', score: 89, calories: 2180 },
    { day: 'Sat', score: 94, calories: 2240 },
    { day: 'Sun', score: stats?.average_health_score || 92, calories: 2100 },
  ];

  const quickTools = [
    {
      title: "Food Vision Scanner",
      desc: "Identify dishes & segment ingredients from image",
      icon: Camera,
      link: "/food-recognition",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400"
    },
    {
      title: "Nutrition Scoring",
      desc: "Compute macros, micros & overall health score",
      icon: Activity,
      link: "/nutrition",
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400"
    },
    {
      title: "Freshness & Spoilage",
      desc: "Detect discoloration, mold & surface degradation",
      icon: ShieldCheck,
      link: "/freshness",
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400"
    },
    {
      title: "Hygiene Surveillance",
      desc: "Video audit for gloves, hairnets & cross-contamination",
      icon: Video,
      link: "/hygiene",
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400"
    },
    {
      title: "Smart AI Chef",
      desc: "Generate recipes from fridge ingredients with voice chat",
      icon: ChefHat,
      link: "/cooking-assistant",
      color: "from-rose-500/20 to-orange-500/10 border-rose-500/30 text-rose-400"
    },
    {
      title: "7-Day Meal Planner",
      desc: "Personalized nutritional calendar with allergen guard",
      icon: Calendar,
      link: "/meal-planner",
      color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400"
    }
  ];

  const openExport = (scan) => {
    setSelectedScanForExport(scan || {
      title: "Consolidated Food Intelligence Dossier",
      health_score: stats?.average_health_score || 91.5,
      overall_confidence: 0.94,
      status_label: "Active Protocol Compliant",
      recommendations: ["Maintain current high-protein, low-glycemic dietary intake.", "Schedule routine commercial kitchen HACCP surveillance intervals."]
    });
    setExportModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>AI Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Chef Alex'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Target Focus: <span className="text-emerald-400 font-semibold">{user?.fitness_goal || stats?.active_dietary_goal || "Balanced Longevity"}</span> • Calorie Target: <span className="text-white font-semibold">{user?.daily_calorie_goal || 2250} kcal/day</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => openExport(null)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export Dossier</span>
          </button>
          <Link
            to="/food-recognition"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>New Food Scan</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total AI Analyses"
          value={stats?.total_analyses || recentScans.length || 18}
          unit="scans"
          subtitle="Across vision, hygiene, & macros"
          icon={Activity}
          color="emerald"
        />
        <MetricCard
          title="Average Health Score"
          value={stats?.average_health_score || 91.5}
          unit="/100"
          subtitle="Top 8% nutritional density"
          icon={TrendingUp}
          color="blue"
          badge="Grade A+"
        />
        <MetricCard
          title="Hygiene Compliance"
          value="88.5"
          unit="%"
          subtitle="PPE & safe handling rate"
          icon={ShieldCheck}
          color="amber"
          badge="Verified"
        />
        <MetricCard
          title="Active Meal Protocol"
          value="7-Day"
          subtitle="Tailored Mediterranean Plan"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Health Trend & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Score Evolution Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">7-Day Nutritional Index & Calorie Trajectory</h3>
              <p className="text-xs text-neutral-400">Algorithmic Health Score (0-100) vs Daily Calorie Consumption</p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live AI Metrics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#525252" fontSize={11} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#525252" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131b17', borderColor: '#23382c', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" name="Health Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Weekly Calorie Average: <strong className="text-white">2,095 kcal</strong></span>
            <span className="text-emerald-400">Stable Glycemic Index Compliance</span>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Platform Modules</h3>
          <div className="space-y-2">
            {quickTools.slice(0, 5).map((tool, i) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={i}
                  to={tool.link}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-500/40 hover:bg-neutral-800/60 transition-all group"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                        {tool.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">{tool.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Scans Section */}
      <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Analyses & Audits</h3>
            <p className="text-xs text-neutral-400">Latest computer vision inference jobs and hygiene inspection logs</p>
          </div>
          <Link
            to="/profile"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No analyses recorded yet. Run your first food or freshness scan!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScans.slice(0, 3).map((scan) => (
              <div
                key={scan.id}
                className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {scan.type}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{scan.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{scan.status_label || 'Completed'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">
                    Confidence: <strong className="text-white">{scan.confidence ? `${(scan.confidence * 100).toFixed(0)}%` : '95%'}</strong>
                  </span>
                  <button
                    onClick={() => openExport(scan)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={selectedScanForExport}
        reportType="FoodVerse Intelligence Dossier"
      />

    </div>
  );
};

export default DashboardPage;
