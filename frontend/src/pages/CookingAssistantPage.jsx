import React, { useState, useEffect, useRef } from 'react';
import { recipeAPI, chatAPI } from '../services/api';
import {
  ChefHat,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Clock,
  Flame,
  Bookmark,
  Check,
  Plus,
  X,
  Shuffle,
  Bot,
  User,
  AlertCircle
} from 'lucide-react';

const CookingAssistantPage = () => {
  // Recipe Generation State
  const [ingredients, setIngredients] = useState(["Quinoa", "Spinach", "Garlic", "Salmon", "Tomatoes"]);
  const [newIngredient, setNewIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Conversational Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your FoodVerse AI Chef. Ask me about ingredient substitutions, secret cooking techniques, or tell me what's in your pantry for instant bespoke recipes!"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef(null);

  // Quick suggestion prompts
  const quickQuestions = [
    "What can I substitute for heavy cream?",
    "How to get crispy skin on pan-seared salmon?",
    "Suggest a high-protein dinner under 20 minutes."
  ];

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const fetchRecipes = async () => {
    setRecipesLoading(true);
    try {
      const res = await recipeAPI.generateRecipes({
        available_ingredients: ingredients,
        servings: 2
      });
      setRecipes(res.data);
      if (res.data.length > 0) {
        setSelectedRecipe(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecipesLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || userInput;
    if (!query.trim()) return;

    const newHistory = [...chatMessages, { role: 'user', content: query }];
    setChatMessages(newHistory);
    setUserInput("");
    setChatLoading(true);

    try {
      const res = await chatAPI.sendMessage(
        query,
        newHistory.map(m => ({ role: m.role, content: m.content })),
        selectedRecipe?.title || null
      );
      setChatMessages([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages([
        ...newHistory,
        { role: 'assistant', content: "My culinary reasoning engine encountered a slight connection delay. You can still browse our pre-generated chef recipes on the left!" }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Web Speech API Voice Recognition
  const toggleVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      handleSendMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleBookmark = async (recipe) => {
    try {
      await recipeAPI.saveRecipe(recipe);
      setBookmarkedIds(new Set([...bookmarkedIds, recipe.id]));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Interactive Culinary Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Smart AI Cooking Assistant</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Turn available pantry ingredients into chef-crafted recipes with smart substitutions, step-by-step guides, and natural voice interaction.
        </p>
      </div>

      {/* Main Grid: Left = Ingredients & Recipes, Right = Selected Recipe Detail & Voice Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 cols): Ingredients & Recipe List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ingredient Input Box */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Available Pantry Ingredients</h2>
            
            <form onSubmit={handleAddIngredient} className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredient (e.g. Avocado, Garlic)..."
                className="flex-1 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <button
              onClick={fetchRecipes}
              disabled={recipesLoading}
              className="w-full py-2.5 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{recipesLoading ? 'Generating Recipes...' : 'Regenerate Recipe Matches'}</span>
            </button>
          </div>

          {/* Generated Recipe Cards List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Matched Recipe Recommendations</h3>
            
            {recipes.map((r) => {
              const isSelected = selectedRecipe?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipe(r)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-neutral-900 border-emerald-500/50 glow-emerald'
                      : 'glass-card border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{r.cuisine}</span>
                    <span className="text-[10px] text-neutral-400">{r.difficulty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{r.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{r.tagline}</p>
                  
                  <div className="mt-3 flex items-center space-x-4 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/60">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{r.prep_time_minutes + r.cook_time_minutes} mins</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span>{r.nutrition.calories} kcal</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column (7 cols): Selected Recipe Instructions + Conversational Chat */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Selected Recipe Details */}
          {selectedRecipe && (
            <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-6">
              <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {selectedRecipe.cuisine} • {selectedRecipe.difficulty} • Serves {selectedRecipe.servings}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedRecipe.title}</h2>
                  <p className="text-xs text-neutral-300 mt-1">{selectedRecipe.tagline}</p>
                </div>

                <button
                  onClick={() => handleBookmark(selectedRecipe)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    bookmarkedIds.has(selectedRecipe.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{bookmarkedIds.has(selectedRecipe.id) ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Nutrition strip */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Calories</span>
                  <strong className="text-white">{selectedRecipe.nutrition.calories} kcal</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Protein</span>
                  <strong className="text-emerald-400">{selectedRecipe.nutrition.protein}g</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Carbs</span>
                  <strong className="text-blue-400">{selectedRecipe.nutrition.carbs}g</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Fats</span>
                  <strong className="text-amber-400">{selectedRecipe.nutrition.fats}g</strong>
                </div>
              </div>

              {/* Ingredients & Alternatives */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Ingredients & Smart Alternatives</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${ing.is_user_available ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <span className="font-semibold text-white">{ing.name}</span>
                        <span className="text-neutral-400">({ing.quantity})</span>
                      </div>
                      {ing.alternatives?.length > 0 && (
                        <div className="text-[11px] text-neutral-400">
                          <span className="text-neutral-500">Alt:</span> {ing.alternatives.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Instructions */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Step-by-Step Directions</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-neutral-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chef Tips */}
              {selectedRecipe.chef_tips?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 text-xs">
                  <span className="font-bold text-emerald-400 block">Chef's Secret Technique:</span>
                  {selectedRecipe.chef_tips.map((tip, idx) => (
                    <p key={idx} className="text-neutral-300 leading-relaxed text-[11px]">• {tip}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interactive AI Culinary Chat Assistant */}
          <div className="glass-card rounded-2xl p-6 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Ask Chef FoodVerse (AI Cooking Q&A)</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Voice Enabled
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-2 text-xs ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChefHat className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-neutral-950 font-medium rounded-tr-none'
                        : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center space-x-2 text-xs text-neutral-400 p-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span>Chef is formulating advice...</span>
                </div>
              )}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white hover:border-emerald-500/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input & Voice Controls */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask cooking questions, wine pairings, heat control..."
                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              
              <button
                type="button"
                onClick={toggleVoiceRecognition}
                title="Voice Input"
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-emerald-400'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={chatLoading || !userInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CookingAssistantPage;
