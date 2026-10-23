import React from 'react';
import { Recipe } from '../types/mealPlanner';
import { MealCard } from './MealCard';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: Recipe[];
  onOpenDetails: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onAddToGrocery: (recipe: Recipe) => void;
  onNavigateToPlanner: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onOpenDetails,
  onToggleFavorite,
  onAddToGrocery,
  onNavigateToPlanner,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#F5F0E8]">
              Saved Family Favorites
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
              {favorites.length} Recipes
            </span>
          </div>
          <p className="text-xs text-[#A9A09A] mt-1">
            Your family's highest rated dishes. Ready for 1-click inclusion into future AI meal scheduling rotations.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToPlanner}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md active:scale-[0.99]"
        >
          <span>Schedule into Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#18100F] border border-[#3A2925] flex items-center justify-center mx-auto text-[#A9A09A]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#F5F0E8]">
            No saved favorites yet
          </h3>
          <p className="text-xs text-[#A9A09A] max-w-sm mx-auto">
            Click the heart icon on any meal card in the Meal Planner to store family favorites for quick access.
          </p>
          <button
            type="button"
            onClick={onNavigateToPlanner}
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium"
          >
            Explore Meal Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((recipe) => (
            <MealCard
              key={recipe.id}
              recipe={recipe}
              onOpenDetails={onOpenDetails}
              onToggleFavorite={onToggleFavorite}
              onAddToGrocery={onAddToGrocery}
            />
          ))}
        </div>
      )}
    </div>
  );
};
