import React, { useState } from 'react';
import { DayPlan, Recipe } from '../types/mealPlanner';
import {
  Clock,
  Flame,
  ChefHat,
  CheckCircle2,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  ArrowRightLeft,
  Heart,
} from 'lucide-react';

interface DayByDayViewProps {
  weekPlan: DayPlan[];
  onOpenDetails: (recipe: Recipe) => void;
  onSwapMeal: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToGrocery: (recipe: Recipe) => void;
}

export const DayByDayView: React.FC<DayByDayViewProps> = ({
  weekPlan,
  onOpenDetails,
  onSwapMeal,
  onToggleFavorite,
  onAddToGrocery,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentDay = weekPlan[selectedDayIndex] || weekPlan[0];

  const mealSlots: { label: string; time: string; recipe: Recipe }[] = [
    { label: 'Morning Breakfast', time: '08:00 AM', recipe: currentDay.breakfast },
    { label: 'Midday Lunch', time: '12:30 PM', recipe: currentDay.lunch },
    { label: 'Family Dinner', time: '07:00 PM', recipe: currentDay.dinner },
    { label: 'Evening Artisan Snack', time: '09:00 PM', recipe: currentDay.snack },
  ];

  return (
    <div className="space-y-6">
      {/* Day Selector Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {weekPlan.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-w-[120px] p-3 rounded-xl border transition-all text-left ${
                isSelected
                  ? 'bg-gradient-to-b from-[#2F1F1C] to-[#211715] border-emerald-500/70 shadow-lg shadow-black/40'
                  : 'bg-[#181110] border-[#3A2925] text-[#A9A09A] hover:text-[#F5F0E8] hover:bg-[#211715]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-serif text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-[#F5F0E8]'}`}>
                  {day.day}
                </span>
                <span className="text-[10px] font-mono text-[#A9A09A]">
                  {day.dateStr}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#E8AD48]">{day.totalCalories} kcal</span>
                <span className="text-emerald-400">{day.dailyPantryMatch}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Overview Banner */}
      <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-[#F5F0E8]">
              {currentDay.day} Culinary Schedule
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              {currentDay.dailyPantryMatch}% In Stock
            </span>
          </div>
          <p className="text-xs text-[#A9A09A] mt-1">
            Total planned calories: <span className="text-[#E8AD48] font-mono font-semibold">{currentDay.totalCalories} kcal</span> · 4 nourishing courses tailored for family wellness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onAddToGrocery(currentDay.breakfast);
              onAddToGrocery(currentDay.lunch);
              onAddToGrocery(currentDay.dinner);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#2A1E1B] hover:bg-[#352522] text-xs font-medium text-[#F5F0E8] border border-[#3A2925] flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#E8AD48]" />
            <span>Add Day to Grocery</span>
          </button>
        </div>
      </div>

      {/* Course Timeline Cards */}
      <div className="space-y-4">
        {mealSlots.map((slot) => {
          const rec = slot.recipe;
          return (
            <div
              key={slot.label}
              className="bg-[#211715] border border-[#3A2925] hover:border-emerald-500/40 rounded-2xl p-4 md:p-5 transition-all shadow-md hover:shadow-xl hover:shadow-black/40 flex flex-col md:flex-row gap-5 items-stretch"
            >
              {/* Photo */}
              <div className="w-full md:w-56 h-40 md:h-auto rounded-xl overflow-hidden relative shrink-0 bg-[#160E0D]">
                <img
                  src={rec.image}
                  alt={rec.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-black/60 text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                    {slot.time}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8AD48] font-semibold">
                      {slot.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(rec)}
                        className="p-1 rounded-md text-[#A9A09A] hover:text-rose-400 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${rec.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSwapMeal(rec)}
                        className="p-1 rounded-md text-[#A9A09A] hover:text-emerald-400 transition-colors"
                        title="Swap meal"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3
                    onClick={() => onOpenDetails(rec)}
                    className="font-serif text-lg font-bold text-[#F5F0E8] hover:text-emerald-300 cursor-pointer mt-1"
                  >
                    {rec.title}
                  </h3>

                  <p className="text-xs text-[#A9A09A] mt-1 line-clamp-2 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono text-[#A9A09A]">
                    <span className="flex items-center gap-1 text-[#F5F0E8]">
                      <Clock className="w-3.5 h-3.5 text-[#E8AD48]" />
                      {rec.prepTime + rec.cookTime} mins
                    </span>
                    <span className="flex items-center gap-1 text-[#F5F0E8]">
                      <Flame className="w-3.5 h-3.5 text-emerald-400" />
                      {rec.calories} kcal
                    </span>
                    <span className="text-emerald-400">
                      {rec.protein}g protein · {rec.carbs}g carbs · {rec.fat}g fat
                    </span>
                  </div>

                  {rec.chefTips && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-[#181110] border border-[#3A2925]/60 flex items-start gap-2 text-xs text-[#F5F0E8]/90">
                      <ChefHat className="w-3.5 h-3.5 text-[#E8AD48] shrink-0 mt-0.5" />
                      <p className="italic text-[11px] text-[#A9A09A]">
                        <span className="text-[#E8AD48] font-semibold not-italic mr-1">Chef Auguste:</span>
                        {rec.chefTips}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#3A2925]/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      {rec.pantryMatchScore}% Ingredients in Stock
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToGrocery(rec)}
                      className="px-3 py-1.5 rounded-lg bg-[#2A1E1B] hover:bg-[#382622] text-xs text-[#F5F0E8] border border-[#3A2925] flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-[#E8AD48]" />
                      <span>Add to List</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenDetails(rec)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-colors"
                    >
                      View Recipe & Steps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
