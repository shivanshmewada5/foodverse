import React, { useState } from 'react';
import { freshnessAPI } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import ExportReportModal from '../components/ExportReportModal';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Sparkles,
  Printer,
  Calendar,
  AlertOctagon,
  Eye,
  Activity
} from 'lucide-react';

const FreshnessDetectionPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const sampleFreshnessItems = [
    { key: "fresh_produce", label: "Fresh Garden Greens", tag: "Class: Fresh" },
    { key: "moderate_apple", label: "Moderately Ripe Apple", tag: "Class: Moderately Fresh" },
    { key: "spoiled_strawberry", label: "Spoiled Strawberry", tag: "Class: Mold / Spoiled" },
  ];

  const handleImageSelected = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleSampleSelected = (sampleKey, label) => {
    setSelectedFile(null);
    setPreviewUrl(`/sample_media/${sampleKey}.jpg`);
    setResult(null);
    setError('');
    runFreshnessAnalysis(null, sampleKey);
  };

  const runFreshnessAnalysis = async (fileObj, sampleKey) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (fileObj) {
        formData.append('file', fileObj);
      } else if (sampleKey) {
        formData.append('sample_key', sampleKey);
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        setError('Please choose or upload a food produce photo.');
        setLoading(false);
        return;
      }

      const res = await freshnessAPI.analyzeFreshness(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze food freshness.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Fresh":
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
          border: "border-emerald-500/40 glow-emerald"
        };
      case "Moderately Fresh":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
          border: "border-amber-500/40"
        };
      case "Potentially Spoiled":
      default:
        return {
          bg: "bg-red-500/15 text-red-400 border-red-500/30",
          icon: XCircle,
          border: "border-red-500/50"
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Computer Vision Spoilage & Decay Classifier</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Food Freshness Detection</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Detect color shifts, surface texture roughness, and fungal mold patterns using spectral CV filters.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export Freshness Dossier</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Main Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Input Produce Scan</h2>

          <ImageUploader
            onImageSelected={handleImageSelected}
            onSampleSelected={handleSampleSelected}
            previewUrl={previewUrl}
            isLoading={loading}
            samples={sampleFreshnessItems}
            title="Upload Produce or Meal Photo"
            subtitle="Analyzes fruit, vegetable, bakery, or protein surfaces"
          />

          <button
            type="button"
            onClick={() => runFreshnessAnalysis()}
            disabled={loading || (!selectedFile && !previewUrl)}
            className="w-full py-3 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Scanning Surface Texture & Hue...' : 'Evaluate Freshness'}</span>
          </button>

          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <span className="font-semibold text-neutral-300">Analysis Methodology:</span>
            <p>Lab Colorimetry (browning & oxidation index) + Laplacian texture variance (surface collapse) + HSV spore cluster mask.</p>
          </div>
        </div>

        {/* Right Column: Freshness Classification Results */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="glass-card rounded-2xl p-16 border border-neutral-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Running SpoilageNet CV Engine...</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Comparing tissue pigment shifts against reference freshness spectra.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Classification Banner */}
              {(() => {
                const badge = getStatusBadge(result.freshness_status);
                const BadgeIcon = badge.icon;
                return (
                  <div className={`glass-card rounded-2xl p-6 border ${badge.border} space-y-4`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Classification Verdict</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <h2 className="text-2xl font-black text-white">{result.freshness_status}</h2>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center space-x-1 ${badge.bg}`}>
                            <BadgeIcon className="w-3.5 h-3.5" />
                            <span>{(result.overall_confidence * 100).toFixed(0)}% confidence</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-neutral-400 block">Freshness Score</span>
                        <span className="text-2xl font-black text-white">
                          {result.freshness_score} <span className="text-sm font-normal text-neutral-400">/ 100</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Est. Shelf Life</span>
                        <p className="text-base font-bold text-white mt-0.5 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{result.estimated_shelf_life_days} days remaining</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Oxidation Index</span>
                        <p className="text-base font-bold text-white mt-0.5">
                          {result.color_degradation_index}% degradation
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Surface Roughness</span>
                        <p className="text-base font-bold text-white mt-0.5">
                          {result.surface_texture_abnormality}% anomaly
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Detected Visual Anomalies */}
              <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Surface Anomaly Visualizations</h3>
                </div>

                <div className="space-y-3">
                  {result.detected_anomalies.map((anom, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-white">{anom.category}</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            anom.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                            anom.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {anom.severity} Severity
                          </span>
                        </div>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">{anom.description}</p>
                      </div>
                      <div className="text-right whitespace-nowrap flex-shrink-0">
                        <span className="text-[10px] text-neutral-500 block">Affected Area</span>
                        <span className="text-xs font-bold text-white">{anom.affected_percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Storage Recommendations */}
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 text-xs">
                  <span className="font-bold text-emerald-400 block">Recommended Handling & Storage:</span>
                  <p className="text-neutral-300 leading-relaxed">{result.storage_recommendation}</p>
                </div>

                {/* Safety Directives */}
                <div className="space-y-1 text-xs text-neutral-400">
                  <span className="font-semibold text-neutral-300 block mb-1">Safety Guidelines:</span>
                  {result.safety_instructions.map((inst, iIdx) => (
                    <div key={iIdx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Safety Notice Alert */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-start space-x-3">
                <AlertOctagon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  {result.safety_disclaimer}
                </p>
              </div>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-16 border border-neutral-800 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Produce Scanned</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Upload a produce photo or select a quick sample on the left to evaluate visible spoilage indicators.
              </p>
            </div>
          )}
        </div>

      </div>

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={result}
        reportType="Produce Freshness Assessment"
      />

    </div>
  );
};

export default FreshnessDetectionPage;
