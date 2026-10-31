import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import {
  Camera,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Scale,
  Activity
} from 'lucide-react';

const FoodRecognitionPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const sampleDishes = [
    { key: "quinoa_bowl", label: "Quinoa Salad Bowl", tag: "Greens & Grain" },
    { key: "salmon_plate", label: "Atlantic Salmon", tag: "High-Protein Seafood" },
    { key: "avocado_toast", label: "Avocado Egg Toast", tag: "Brunch / Healthy Fat" },
    { key: "penne_pasta", label: "Penne all'Arrabbiata", tag: "Italian Pasta" },
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
    runAnalysis(null, sampleKey);
  };

  const runAnalysis = async (fileObj, sampleKey) => {
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
        setError('Please select an image first.');
        setLoading(false);
        return;
      }

      const res = await foodAPI.analyzeImage(formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze food image. Please try another photo.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToNutrition = () => {
    if (result) {
      navigate('/nutrition', {
        state: {
          foodName: result.primary_dish,
          imageUrl: result.image_url,
          confidence: result.overall_confidence
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Computer Vision Inference Module</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Food & Ingredient Recognition</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Detect multiple food items, estimate portion sizes, and isolate raw ingredients with neural confidence scores.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Analysis Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload & Controls */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-800 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Input Food Image</h2>
          
          <ImageUploader
            onImageSelected={handleImageSelected}
            onSampleSelected={handleSampleSelected}
            previewUrl={previewUrl}
            isLoading={loading}
            samples={sampleDishes}
          />

          <button
            type="button"
            onClick={() => runAnalysis()}
            disabled={loading || (!selectedFile && !previewUrl)}
            className="w-full py-3 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Running Vision Inference...' : 'Analyze Image with AI'}</span>
          </button>

          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <span className="font-semibold text-neutral-300">Model Pipeline:</span>
            <p>FoodVerse VisionNet v2.4 (HSV Color Histogram + Laplacian Texture Variance + Multimodal Classifier).</p>
          </div>
        </div>

        {/* Right Column: AI Detection Results */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="glass-card rounded-2xl p-16 border border-neutral-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-spin">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Extracting Visual Features...</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Analyzing RGB/HSV color spaces, spatial edge density, and bounding regions across the dish.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              
              {/* Primary Dish Overview Card */}
              <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 glow-emerald space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Primary Identified Dish</span>
                    <h2 className="text-2xl font-black text-white mt-0.5">{result.primary_dish}</h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-neutral-400 block">Overall AI Confidence</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      {(result.overall_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Items Isolated</span>
                    <p className="text-lg font-bold text-white mt-0.5">{result.total_items_count} components</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Inference Latency</span>
                    <p className="text-lg font-bold text-white mt-0.5">{result.processing_time_ms} ms</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Next Action</span>
                    <button
                      onClick={proceedToNutrition}
                      className="mt-1 flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Analyze Macros</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Detected Items & Ingredient Segmentation */}
              <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detected Components & Ingredients</h3>
                </div>

                <div className="space-y-3">
                  {result.all_detected_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <span className="text-[11px] text-neutral-400">
                            Category: {item.dish_category} • Est. Weight: ~{item.estimated_portion_grams}g
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {(item.confidence * 100).toFixed(0)}% match
                        </span>
                      </div>

                      {item.ingredients.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">
                            Sub-ingredients Identified:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.ingredients.map((ing, iIdx) => (
                              <span
                                key={iIdx}
                                className="px-2 py-0.5 rounded-md text-[11px] bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                              >
                                {ing.name} ({(ing.confidence * 100).toFixed(0)}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Direct Action Link to Nutrition */}
                <div className="pt-2">
                  <button
                    onClick={proceedToNutrition}
                    className="w-full py-3 px-4 rounded-xl font-bold bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/40 text-emerald-400 transition-all text-sm flex items-center justify-center space-x-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>View Complete Nutritional & Health Score Breakdown</span>
                  </button>
                </div>
              </div>

              {/* Safety & Allergy Disclaimer */}
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p>{result.disclaimer}</p>
              </div>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-16 border border-neutral-800 text-center space-y-3">
              <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Image Analyzed Yet</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Upload your dish snapshot or click any instant sample on the left to trigger the FoodVerse computer vision engine.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default FoodRecognitionPage;
