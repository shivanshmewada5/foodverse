import React, { useState } from 'react';
import { hygieneAPI } from '../services/api';
import VideoUploader from '../components/VideoUploader';
import ExportReportModal from '../components/ExportReportModal';
import MetricCard from '../components/MetricCard';
import {
  Video,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  AlertCircle,
  FileText,
  UserCheck,
  Flame,
  Award
} from 'lucide-react';

const RestaurantHygienePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleVideoSelected = (file) => {
    setSelectedFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleDemoSelected = () => {
    setSelectedFile(null);
    setVideoPreviewUrl('/sample_media/kitchen_hygiene_demo.mp4');
    setResult(null);
    setError('');
    runVideoAnalysis(null, 'kitchen_hygiene_demo');
  };

  const runVideoAnalysis = async (fileObj, sampleKey) => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (fileObj) {
        formData.append('video', fileObj);
      } else if (sampleKey) {
        formData.append('sample_key', sampleKey);
      } else if (selectedFile) {
        formData.append('video', selectedFile);
      } else {
        setError('Please select or upload a kitchen video recording.');
        setLoading(false);
        return;
      }

      const res = await hygieneAPI.analyzeVideo(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Video analysis failed. Please verify format.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "High":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "Medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Low":
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>Commercial Kitchen Surveillance & HACCP Safety Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Restaurant Hygiene Monitoring</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Automated CCTV video auditing for PPE compliance, glove usage, hairnet wear, cross-contamination, and food coverage.
          </p>
        </div>

        {result && (
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export Official Audit Report</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Kitchen Footage Ingestion</h2>
        
        <VideoUploader
          onVideoSelected={handleVideoSelected}
          onDemoSelected={handleDemoSelected}
          videoPreviewUrl={videoPreviewUrl}
          isLoading={loading}
        />

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => runVideoAnalysis()}
            disabled={loading || (!selectedFile && !videoPreviewUrl)}
            className="py-3 px-6 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Sampling Frames & Auditing HACCP Protocols...' : 'Start Hygiene AI Audit'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {loading ? (
        <div className="glass-card rounded-2xl p-16 border border-neutral-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-spin">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Auditing Video Frames...</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Extracting pose landmarks, glove boundaries, hair coverings, and prep container covers across timeline.
          </p>
        </div>
      ) : result ? (
        <div className="space-y-8">
          
          {/* Top Audit Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 glow-emerald flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Hygiene Score</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-black bg-emerald-500 text-neutral-950">
                  Grade {result.hygiene_grade}
                </span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black text-emerald-400">{result.overall_hygiene_score}</span>
                <span className="text-sm font-semibold text-neutral-400"> / 100</span>
              </div>
              <p className="text-[11px] text-neutral-400">HACCP Baseline Standard: 80+</p>
            </div>

            <MetricCard
              title="Frames Inspected"
              value={result.total_frames_analyzed}
              unit="frames"
              subtitle={`Duration: ${result.duration_seconds}s`}
              icon={Clock}
              color="blue"
            />

            <MetricCard
              title="Flagged Violations"
              value={result.violations.length}
              unit="incidents"
              subtitle={`${result.critical_risk_count} critical, ${result.moderate_risk_count} moderate`}
              icon={AlertTriangle}
              color={result.critical_risk_count > 0 ? "rose" : "amber"}
            />

            <MetricCard
              title="Station Status"
              value={result.hygiene_grade === 'A' || result.hygiene_grade === 'B' ? 'Approved' : 'Action Req'}
              subtitle="Inspection Certificate Valid"
              icon={ShieldCheck}
              color={result.hygiene_grade === 'A' || result.hygiene_grade === 'B' ? 'emerald' : 'rose'}
            />

          </div>

          {/* Compliance Metrics Breakdown */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">HACCP Compliance Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {result.metrics.map((m, mIdx) => (
                <div key={mIdx} className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <span className="text-xs font-bold text-white block">{m.category}</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-emerald-400">{m.score}</span>
                    <span className="text-[10px] text-neutral-400">/100</span>
                  </div>
                  <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    m.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timestamped Incidents Log */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Timestamp-Based Incident Chronology</h3>
                <p className="text-xs text-neutral-400">Specific moments where PPE or handling deviations were flagged</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                {result.violations.length} Incidents Recorded
              </span>
            </div>

            <div className="space-y-3">
              {result.violations.map((vio) => (
                <div
                  key={vio.id}
                  className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-neutral-800 text-emerald-400 border border-neutral-700">
                        {vio.timestamp_str}
                      </span>
                      <h4 className="text-sm font-bold text-white">{vio.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getRiskBadge(vio.risk_level)}`}>
                        {vio.risk_level} Risk
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Confidence: {(vio.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">{vio.description}</p>

                  <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-emerald-400 font-semibold">
                      Action Required: <span className="text-neutral-300 font-normal">{vio.corrective_action}</span>
                    </span>
                    {vio.requires_human_verification && (
                      <span className="text-[10px] text-amber-400 font-semibold flex items-center space-x-1 whitespace-nowrap">
                        <AlertCircle className="w-3 h-3" />
                        <span>Requires Manager Verification</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Corrective Actions */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">Recommended Supervisory Directives:</span>
              <ul className="space-y-1.5 text-neutral-400">
                {result.recommended_corrective_actions.map((act, aIdx) => (
                  <li key={aIdx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Audit Disclaimer */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              {result.human_verification_disclaimer}
            </p>
          </div>

        </div>
      ) : null}

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        data={result}
        reportType="HACCP Kitchen Hygiene Audit Dossier"
      />

    </div>
  );
};

export default RestaurantHygienePage;
