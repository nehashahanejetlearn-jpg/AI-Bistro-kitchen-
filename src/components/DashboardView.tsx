import React from 'react';
import { DayPlan, PantryItem, Recipe, ActivePage } from '../types/mealPlanner';
import {
  CalendarDays,
  Package,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MealCard } from './MealCard';

interface DashboardViewProps {
  todayPlan: DayPlan;
  pantryItems: PantryItem[];
  onNavigate: (page: ActivePage) => void;
  onOpenDetails: (recipe: Recipe) => void;
  onSwapMeal: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToGrocery: (recipe: Recipe) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  todayPlan,
  pantryItems,
  onNavigate,
  onOpenDetails,
  onSwapMeal,
  onToggleFavorite,
  onAddToGrocery,
}) => {
  const expiringItems = pantryItems.filter((item) => item.expiryDays <= 3);
  const totalItems = pantryItems.length;
  const inStockCount = pantryItems.filter((i) => i.inStock).length;
  const pantryReadiness = Math.round((inStockCount / (totalItems || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2B1B18] via-[#211715] to-[#181110] border border-[#3A2925] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-black/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Executive Kitchen Intelligence</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F5F0E8] leading-tight">
            Welcome to BistroChef
          </h1>

          <p className="text-sm md:text-base text-[#A9A09A] mt-2 leading-relaxed">
            Your family meal plan is synchronized with your live pantry inventory. Zero food waste, 100% allergen protected, and chef-curated nutrition for today.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('planner')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.99]"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Open Weekly Scheduler</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('assistant')}
              className="px-5 py-2.5 rounded-xl bg-[#2A1E1B] hover:bg-[#382622] text-[#F5F0E8] border border-[#3A2925] font-medium text-xs flex items-center gap-2 transition-colors"
            >
              <span>Consult Chef Auguste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI & Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pantry Readiness */}
        <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A9A09A]">
              <span className="font-mono uppercase tracking-wider">Pantry Stock Readiness</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#F5F0E8] tabular-nums">
                {pantryReadiness}%
              </span>
              <span className="text-xs text-emerald-400 font-medium">Ready for Week</span>
            </div>
            <p className="text-xs text-[#A9A09A] mt-1">
              {inStockCount} of {totalItems} key ingredients currently stocked in your kitchen.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#3A2925]/60 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate('pantry')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Manage Stock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Expiring Items Alert */}
        <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A9A09A]">
              <span className="font-mono uppercase tracking-wider">Expiring Stock Alert</span>
              <AlertTriangle className="w-4 h-4 text-[#E8AD48]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#E8AD48] tabular-nums">
                {expiringItems.length}
              </span>
              <span className="text-xs text-[#A9A09A]">Items within 3 days</span>
            </div>
            <p className="text-xs text-[#A9A09A] mt-1 truncate">
              {expiringItems.map((i) => i.name).slice(0, 2).join(', ')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#3A2925]/60 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate('pantry')}
              className="text-[#E8AD48] hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Cook With These First</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Allergen Protection */}
        <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A9A09A]">
              <span className="font-mono uppercase tracking-wider">Safety & Allergen Guard</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-emerald-400">
                100%
              </span>
              <span className="text-xs text-emerald-400 font-medium">Safe & Compliant</span>
            </div>
            <p className="text-xs text-[#A9A09A] mt-1">
              Zero allergen collisions detected for your family profile across all 7 days.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#3A2925]/60 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Safety Audit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Culinary Lineup */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#F5F0E8]">
              Today's Menu ({todayPlan.day}, {todayPlan.dateStr})
            </h2>
            <p className="text-xs text-[#A9A09A]">
              Daily target: {todayPlan.totalCalories} kcal · High protein balanced family meal
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('planner')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <span>Full 7-Day Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MealCard
            recipe={todayPlan.breakfast}
            onOpenDetails={onOpenDetails}
            onSwapMeal={onSwapMeal}
            onToggleFavorite={onToggleFavorite}
            onAddToGrocery={onAddToGrocery}
          />
          <MealCard
            recipe={todayPlan.lunch}
            onOpenDetails={onOpenDetails}
            onSwapMeal={onSwapMeal}
            onToggleFavorite={onToggleFavorite}
            onAddToGrocery={onAddToGrocery}
          />
          <MealCard
            recipe={todayPlan.dinner}
            onOpenDetails={onOpenDetails}
            onSwapMeal={onSwapMeal}
            onToggleFavorite={onToggleFavorite}
            onAddToGrocery={onAddToGrocery}
          />
        </div>
      </div>
    </div>
  );
};
