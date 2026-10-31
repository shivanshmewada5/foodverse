import React from 'react';
import { Sparkles, Shield, Cpu, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950/90 text-neutral-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-neutral-950">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-white">FoodVerse</span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-[11px]">
              Next-generation multimodal AI food intelligence platform combining Computer Vision, Neural Spoilage Analysis, HACCP Kitchen Video Auditing, and Intelligent Culinary Assistants.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">AI Vision Modules</h4>
            <ul className="space-y-2 text-neutral-500">
              <li>Food & Ingredient Segmentation</li>
              <li>Macronutrient & Glycemic Scoring</li>
              <li>Surface Colorimetry & Freshness</li>
              <li>Restaurant Hygiene CCTV Monitoring</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Intelligent Systems</h4>
            <ul className="space-y-2 text-neutral-500">
              <li>Personalized 7-Day Meal Generation</li>
              <li>Allergen Cross-Contamination Guard</li>
              <li>Conversational Culinary Assistant</li>
              <li>PDF / Dossier Health Export</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Safety & Regulatory</h4>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              AI estimates are probabilistic and designed for personal guidance and kitchen workflow auditing. Visual computer vision cannot confirm microbiological sterility or detect odorless pathogens. Human verification required.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-neutral-600">
          <p>© 2026 FoodVerse AI Inc. Built for Scalable Multimodal Food Intelligence.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FastAPI & Vite Online</span>
            </span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
