import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Camera,
  Activity,
  ShieldCheck,
  Video,
  ChefHat,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Flame,
  Award
} from 'lucide-react';

const LandingPage = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: Camera,
      title: "AI Food Recognition",
      description: "Upload any food image. VisionNet segments primary dishes, isolates individual ingredients, and estimates portion weights with high confidence.",
      badge: "Computer Vision",
      link: "/food-recognition"
    },
    {
      icon: Activity,
      title: "AI Nutrition Analysis",
      description: "Calculates precise calories, protein, carbs, fats, fiber, and micronutrients alongside an algorithmic Health Score out of 100 with interactive charts.",
      badge: "NutriNet Algorithm",
      link: "/nutrition"
    },
    {
      icon: ShieldCheck,
      title: "Food Freshness Detection",
      description: "Evaluates surface degradation, colorimetry shifts, texture roughness, and mold spore clusters to classify items as Fresh, Moderately Fresh, or Spoiled.",
      badge: "Surface Colorimetry",
      link: "/freshness"
    },
    {
      icon: Video,
      title: "Restaurant Hygiene CCTV",
      description: "Scans commercial kitchen videos to detect PPE adherence (gloves, hairnets), food covering compliance, and timestamped cross-contamination violations.",
      badge: "HACCP Safety Guard",
      link: "/hygiene"
    },
    {
      icon: ChefHat,
      title: "Smart AI Cooking Assistant",
      description: "Interactive conversational culinary chef. Enter whatever ingredients you have in your fridge for bespoke recipes, instructions, and voice commands.",
      badge: "Multimodal LLM",
      link: "/cooking-assistant"
    },
    {
      icon: Calendar,
      title: "Personalized Meal Planner",
      description: "Customizes 7-day culinary calendars for your age, fitness targets, and dietary choices while proactively cross-referencing anaphylactic allergens.",
      badge: "Nutritional AI",
      link: "/meal-planner"
    }
  ];

  return (
    <div className="space-y-24 py-10">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center pt-8 sm:pt-16 pb-12">
        {/* Glowing backdrop circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal AI Food Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Intelligent Vision & Nutrition for the <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Future of Food</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          From snapshot food recognition and automated macro scoring to commercial kitchen hygiene surveillance and personalized allergen-guarded meal planning.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleDemo}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-lg shadow-emerald-500/25 group"
          >
            <Zap className="w-4 h-4 fill-neutral-950" />
            <span>Launch Instant Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-all"
          >
            <span>Create Free Account</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>OpenCV & Deep Learning Vision</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>HACCP Kitchen Hygiene Monitoring</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>USDA Nutritional Database Model</span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Core Platform Capabilities</h2>
          <p className="text-3xl font-extrabold text-white mt-2">Engineered for Consumers, Chefs, and Safety Auditors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={i}
                to={f.link}
                className="glass-card rounded-2xl p-6 border border-neutral-800/80 hover:border-emerald-500/50 hover:bg-neutral-900/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-emerald-500/20 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">The Multimodal Pipeline</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">How FoodVerse Processes Real-World Signals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 font-black text-sm flex items-center justify-center mx-auto">1</div>
              <h4 className="font-bold text-white text-base">Multimodal Ingestion</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Upload photos of dishes, high-resolution produce scans, audio voice commands, or CCTV surveillance footage from kitchen operations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 font-black text-sm flex items-center justify-center mx-auto">2</div>
              <h4 className="font-bold text-white text-base">AI Model Inference</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Computer vision extracts HSV and Lab colorimetry, Laplacian texture variance, and bounding boxes, corroborated with LLM culinary reasoning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 font-black text-sm flex items-center justify-center mx-auto">3</div>
              <h4 className="font-bold text-white text-base">Actionable Intelligence</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Obtain structured macronutrient graphs, freshness warnings, timestamped hygiene violation audits, and personalized recipes with 1-click PDF export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-10 border border-emerald-500/30 glow-emerald">
          <h2 className="text-3xl font-bold text-white">Experience Food Intelligence Today</h2>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl mx-auto">
            Try the live food vision and kitchen auditor in demo mode with one click, or configure your Gemini API key for advanced multimodal reasoning.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleDemo}
              className="px-8 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-lg shadow-emerald-500/25"
            >
              Get Started with Demo Mode
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
