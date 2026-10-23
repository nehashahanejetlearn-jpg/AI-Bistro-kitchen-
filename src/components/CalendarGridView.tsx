import React from 'react';
import { DayPlan, Recipe } from '../types/mealPlanner';
import { MealCard } from './MealCard';
import { Calendar, Sparkles } from 'lucide-react';

interface CalendarGridViewProps {
  weekPlan: DayPlan[];
  onOpenDetails: (recipe: Recipe) => void;
  onSwapMeal: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToGrocery: (recipe: Recipe) => void;
}

export const CalendarGridView: React.FC<CalendarGridViewProps> = ({
  weekPlan,
  onOpenDetails,
  onSwapMeal,
  onToggleFavorite,
  onAddToGrocery,
}) => {
  return (
    <div className="space-y-6">
      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {weekPlan.map((dayPlan) => (
          <div
            key={dayPlan.day}
            className="bg-[#181110]/90 rounded-2xl border border-[#3A2925] p-3.5 flex flex-col space-y-3 shadow-lg shadow-black/20"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#3A2925]/70">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm text-[#F5F0E8]">
                    {dayPlan.day}
                  </h3>
                  <span className="text-[10px] font-mono text-[#A9A09A]">
                    {dayPlan.dateStr}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-emerald-400">
                  {dayPlan.dailyPantryMatch}% Pantry Match
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-[#E8AD48]">
                  {dayPlan.totalCalories}
                </span>
                <span className="text-[9px] block text-[#A9A09A]">kcal total</span>
              </div>
            </div>

            {/* Meals for this day */}
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <MealCard
                recipe={dayPlan.breakfast}
                onOpenDetails={onOpenDetails}
                onSwapMeal={onSwapMeal}
                onToggleFavorite={onToggleFavorite}
                onAddToGrocery={onAddToGrocery}
              />
              <MealCard
                recipe={dayPlan.lunch}
                onOpenDetails={onOpenDetails}
                onSwapMeal={onSwapMeal}
                onToggleFavorite={onToggleFavorite}
                onAddToGrocery={onAddToGrocery}
              />
              <MealCard
                recipe={dayPlan.dinner}
                onOpenDetails={onOpenDetails}
                onSwapMeal={onSwapMeal}
                onToggleFavorite={onToggleFavorite}
                onAddToGrocery={onAddToGrocery}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
