import React, { useState, useRef } from 'react';
import { Video, Upload, Play, CheckCircle2, AlertCircle } from 'lucide-react';

const VideoUploader = ({
  onVideoSelected,
  onDemoSelected,
  videoPreviewUrl,
  isLoading,
  title = "Upload Kitchen Surveillance Video",
  subtitle = "Supports MP4, MOV, WEBM up to 100MB"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onVideoSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onVideoSelected(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-neutral-800 bg-neutral-900/40 hover:border-emerald-500/50 hover:bg-neutral-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="hidden"
        />

        {videoPreviewUrl ? (
          <div className="max-w-lg mx-auto overflow-hidden rounded-xl border border-neutral-800">
            <video
              src={videoPreviewUrl}
              controls
              className="w-full h-56 bg-neutral-950 object-cover"
            />
            <div className="p-2 bg-neutral-900/80 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Video Loaded</span>
              <span className="text-emerald-400">Click to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
            </div>
            <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Drag & drop kitchen footage or browse files
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 gap-3">
        <div className="flex items-center space-x-2 text-xs text-neutral-300">
          <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Need test footage? Try the verified HACCP kitchen sample video:</span>
        </div>
        <button
          type="button"
          onClick={onDemoSelected}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Load Prep Station Video Demo</span>
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;
