import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  ShieldAlert,
  Clock,
  Users,
  IndianRupee,
  RefreshCw,
  Check,
  Flame,
} from 'lucide-react';
import { AIPlannerConfig } from '../types/mealPlanner';

interface AIConfigPanelProps {
  config: AIPlannerConfig;
  onChangeConfig: (config: AIPlannerConfig) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

export const AIConfigPanel: React.FC<AIConfigPanelProps> = ({
  config,
  onChangeConfig,
  onGeneratePlan,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const suggestionChips = [
    'Plan healthy vegetarian meals',
    'Create high-protein meals for active children',
    'Use ingredients that are about to expire',
    'Plan budget-friendly meals under ₹3,500 per week',
    'Prepare quick 15-minute weekday meals',
    'Avoid nuts, dairy, or other specified allergens',
  ];

  const commonAllergens = [
    'Tree Nuts',
    'Peanuts',
    'Dairy',
    'Gluten',
    'Shellfish',
    'Eggs',
    'Soy',
  ];

  const handleChipClick = (suggestion: string) => {
    // If the suggestion mentions allergens, automatically check allergens too
    let updatedAllergens = [...config.allergens];
    if (suggestion.includes('Avoid nuts') && !updatedAllergens.includes('Tree Nuts')) {
      updatedAllergens.push('Tree Nuts', 'Peanuts');
    }
    if (suggestion.includes('dairy') && !updatedAllergens.includes('Dairy')) {
      updatedAllergens.push('Dairy');
    }

    let updatedTime = config.maxCookingTime;
    if (suggestion.includes('15-minute')) {
      updatedTime = 15;
    }

    let updatedPantry = config.useExpiringPantryFirst;
    if (suggestion.includes('expire')) {
      updatedPantry = true;
    }

    onChangeConfig({
      ...config,
      prompt: suggestion,
      allergens: updatedAllergens,
      maxCookingTime: updatedTime,
      useExpiringPantryFirst: updatedPantry,
    });
  };

  const toggleAllergen = (allergen: string) => {
    const exists = config.allergens.includes(allergen);
    const updated = exists
      ? config.allergens.filter((a) => a !== allergen)
      : [...config.allergens, allergen];
    onChangeConfig({ ...config, allergens: updated });
  };

  return (
    <div className="w-full bg-[#211715] border border-[#3A2925] rounded-2xl p-5 shadow-xl shadow-black/40 flex flex-col justify-between">
      <div>
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3A2925]/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-[#F5F0E8]">
              CONFIGURE AI
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-[#A9A09A] hover:text-[#E8AD48] transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Simple' : 'Filters'}</span>
          </button>
        </div>

        {/* Personalized prompt textarea */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5">
            Personalized Culinary Instructions
          </label>
          <textarea
            value={config.prompt}
            onChange={(e) => onChangeConfig({ ...config, prompt: e.target.value })}
            placeholder="e.g., Plan high-protein meals under 20 mins, avoid dairy, and prioritize salmon & spinach in the pantry..."
            rows={3}
            className="w-full bg-[#160E0D] border border-[#3A2925] focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 rounded-xl p-3 text-sm text-[#F5F0E8] placeholder:text-[#A9A09A]/60 resize-none transition-colors outline-none"
          />
        </div>

        {/* Clickable suggestion chips */}
        <div className="mt-3">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#A9A09A] mb-2">
            Chef Suggestion Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip) => {
              const isSelected = config.prompt === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                      : 'bg-[#19100F] text-[#A9A09A] hover:text-[#F5F0E8] hover:bg-[#2A1E1B] border border-[#3A2925]/70'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergens selector */}
        <div className="mt-4 pt-4 border-t border-[#3A2925]/60">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F0E8]">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Exclude Allergens</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">
              {config.allergens.length === 0 ? 'None selected' : `${config.allergens.length} active`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {commonAllergens.map((allergen) => {
              const isChecked = config.allergens.includes(allergen);
              return (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleAllergen(allergen)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    isChecked
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                      : 'bg-[#160E0D] text-[#A9A09A] hover:text-[#F5F0E8] border border-[#3A2925]/70'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-amber-400" />}
                  <span>{allergen}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-[#3A2925]/60 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-[11px] text-[#A9A09A] mb-1">
                  <Users className="w-3 h-3 text-emerald-400" /> Family Servings
                </label>
                <select
                  value={config.familyMembers}
                  onChange={(e) =>
                    onChangeConfig({ ...config, familyMembers: Number(e.target.value) })
                  }
                  className="w-full bg-[#160E0D] border border-[#3A2925] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none"
                >
                  <option value={2}>2 Servings</option>
                  <option value={3}>3 Servings</option>
                  <option value={4}>4 Servings (Standard)</option>
                  <option value={6}>6 Servings (Large)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1 text-[11px] text-[#A9A09A] mb-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Max Cook Time
                </label>
                <select
                  value={config.maxCookingTime}
                  onChange={(e) =>
                    onChangeConfig({ ...config, maxCookingTime: Number(e.target.value) })
                  }
                  className="w-full bg-[#160E0D] border border-[#3A2925] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none"
                >
                  <option value={15}>Quick (≤ 15 mins)</option>
                  <option value={30}>Standard (≤ 30 mins)</option>
                  <option value={45}>Gourmet (≤ 45 mins)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] text-[#A9A09A] mb-1">
                <IndianRupee className="w-3 h-3 text-emerald-400" /> Weekly Target Budget
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={2000}
                  max={7000}
                  step={250}
                  value={config.budgetCap}
                  onChange={(e) =>
                    onChangeConfig({ ...config, budgetCap: Number(e.target.value) })
                  }
                  className="flex-1 accent-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-semibold text-[#F5F0E8] w-16 text-right">
                  ₹{config.budgetCap}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#F5F0E8] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Prioritize Expiring Stock
              </span>
              <button
                type="button"
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    useExpiringPantryFirst: !config.useExpiringPantryFirst,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  config.useExpiringPantryFirst ? 'bg-emerald-500' : 'bg-[#160E0D] border border-[#3A2925]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    config.useExpiringPantryFirst ? 'left-4' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Action Button */}
      <div className="mt-6 pt-4 border-t border-[#3A2925]/60">
        <button
          type="button"
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/80 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer border border-emerald-400/40"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>ORCHESTRATING PLAN WITH GEMINI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>GENERATE AI MEAL PLAN</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
