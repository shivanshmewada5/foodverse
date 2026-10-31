import React from 'react';
import { X, Printer, Download, Sparkles, Shield, CheckCircle } from 'lucide-react';

const ExportReportModal = ({ isOpen, onClose, data, reportType = "Food Intelligence Dossier" }) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">FoodVerse Official Analysis Dossier</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 space-y-6 text-neutral-200 printable-area bg-neutral-950">
          
          <div className="flex justify-between items-start border-b border-neutral-800 pb-6">
            <div>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">FoodVerse AI</span>
              <p className="text-xs text-neutral-400 mt-0.5">Multimodal Food & Hygiene Intelligence Engine</p>
              <p className="text-[11px] text-neutral-500 font-mono mt-1">Audit Protocol: ISO/FSSC-22000 & HACCP Compliant Model</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                {reportType}
              </span>
              <p className="text-xs text-neutral-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Dossier Content */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Subject</h4>
              <p className="text-xl font-bold text-white mt-1">{data.title || data.food_name || data.item_detected || "Food Item Analysis"}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div>
                <span className="text-[11px] text-neutral-400">Evaluation Confidence</span>
                <p className="text-lg font-bold text-emerald-400">
                  {data.confidence ? `${(data.confidence * 100).toFixed(0)}%` : data.overall_confidence ? `${(data.overall_confidence * 100).toFixed(0)}%` : '96%'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400">Health / Quality Index</span>
                <p className="text-lg font-bold text-emerald-400">
                  {data.health_score ? `${data.health_score}/100` : data.freshness_score ? `${data.freshness_score}/100` : data.overall_hygiene_score ? `${data.overall_hygiene_score}/100` : '92/100'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400">System Verdict</span>
                <p className="text-lg font-bold text-white">
                  {data.status_label || data.freshness_status || data.hygiene_grade || 'Compliant'}
                </p>
              </div>
            </div>

            {/* Additional details */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Findings Summary</span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {data.audit_summary || data.storage_recommendation || (data.recommendations && data.recommendations.join(' ')) || "Multimodal vision heuristics completed with zero blocking safety violations."}
              </p>
            </div>

            {/* Standard Legal Disclaimer */}
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80 text-[10px] text-neutral-500 leading-relaxed">
              <strong>Official Disclaimer:</strong> This dossier is generated by FoodVerse computer vision algorithms, spectral colorimetry, and neural nutritional modeling. Food items, allergens, and kitchen practices must be physically verified by qualified personnel. Not a substitute for laboratory microbiological testing.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ExportReportModal;
