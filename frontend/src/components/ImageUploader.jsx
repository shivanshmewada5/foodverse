import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, X, CheckCircle } from 'lucide-react';

const ImageUploader = ({
  onImageSelected,
  onSampleSelected,
  previewUrl,
  isLoading,
  samples = [],
  title = "Upload Food Image",
  subtitle = "Supports high-resolution PNG, JPG, JPEG, WEBP up to 15MB"
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
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : 'border-neutral-800 bg-neutral-900/40 hover:border-emerald-500/50 hover:bg-neutral-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative group max-w-md mx-auto overflow-hidden rounded-xl border border-emerald-500/30">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-xs font-semibold text-emerald-300 bg-neutral-900/90 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                Click to change image
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shadow-inner group-hover:border-emerald-500/40">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Drag & drop or click to browse</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Test Samples */}
      {samples.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Or pick instant demo sample:
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">1-click test</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {samples.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSampleSelected(s.key, s.label)}
                disabled={isLoading}
                className="flex items-center space-x-2 p-2 rounded-xl text-left bg-neutral-900/70 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-800/60 text-neutral-300 hover:text-white transition-all text-xs disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-medium truncate">{s.label}</div>
                  <div className="text-[10px] text-neutral-500">{s.tag}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
