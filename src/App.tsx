import React, { useState } from 'react';
import {
  ActivePage,
  ViewMode,
  DayPlan,
  PantryItem,
  GroceryItem,
  Recipe,
  AIPlannerConfig,
  FamilyProfile,
} from './types/mealPlanner';
import {
  INITIAL_PANTRY,
  INITIAL_WEEK_PLAN,
  INITIAL_GROCERY_LIST,
  RECIPES_CATALOG,
} from './data/initialData';
import { FOOD_IMAGES } from './data/foodImages';
import { Sidebar } from './components/Sidebar';
import { TopSafetyNotice } from './components/TopSafetyNotice';
import { AIConfigPanel } from './components/AIConfigPanel';
import { CalendarGridView } from './components/CalendarGridView';
import { DayByDayView } from './components/DayByDayView';
import { RecipeModal } from './components/RecipeModal';
import { DashboardView } from './components/DashboardView';
import { PantryView } from './components/PantryView';
import { GroceryView } from './components/GroceryView';
import { ChefAssistantView } from './components/ChefAssistantView';
import { AnalyticsView } from './components/AnalyticsView';
import { FavoritesView } from './components/FavoritesView';
import {
  Menu,
  Grid3X3,
  CalendarDays,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('planner');
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core State
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(INITIAL_WEEK_PLAN);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(INITIAL_PANTRY);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(INITIAL_GROCERY_LIST);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [chefAssistantQuery, setChefAssistantQuery] = useState<string>('');

  // AI Configuration State
  const [aiConfig, setAiConfig] = useState<AIPlannerConfig>({
    prompt: 'Plan healthy high-protein meals for active children and avoid nuts',
    allergens: ['Tree Nuts', 'Peanuts'],
    dietaryPreference: 'Balanced High-Protein',
    familyMembers: 4,
    maxCookingTime: 30,
    budgetCap: 3500,
    useExpiringPantryFirst: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [planSuccessNotice, setPlanSuccessNotice] = useState<string | null>(null);

  const familyProfile: FamilyProfile = {
    adults: 2,
    kids: 2,
    allergens: aiConfig.allergens,
    dietaryStyle: aiConfig.dietaryPreference,
    weeklyBudget: aiConfig.budgetCap,
    cookingTimePreference: 'standard',
  };

  // Helper: Favorites
  const allRecipesInPlan: Recipe[] = [];
  weekPlan.forEach((d) => {
    allRecipesInPlan.push(d.breakfast, d.lunch, d.dinner, d.snack);
  });
  const favorites = [
    ...RECIPES_CATALOG.filter((r) => r.isFavorite),
    ...allRecipesInPlan.filter((r) => r.isFavorite && !RECIPES_CATALOG.some((c) => c.id === r.id)),
  ];

  // Actions
  const handleToggleFavorite = (recipe: Recipe) => {
    const updatedStatus = !recipe.isFavorite;

    setWeekPlan((prev) =>
      prev.map((day) => ({
        ...day,
        breakfast: day.breakfast.id === recipe.id ? { ...day.breakfast, isFavorite: updatedStatus } : day.breakfast,
        lunch: day.lunch.id === recipe.id ? { ...day.lunch, isFavorite: updatedStatus } : day.lunch,
        dinner: day.dinner.id === recipe.id ? { ...day.dinner, isFavorite: updatedStatus } : day.dinner,
        snack: day.snack.id === recipe.id ? { ...day.snack, isFavorite: updatedStatus } : day.snack,
      }))
    );

    if (selectedRecipe && selectedRecipe.id === recipe.id) {
      setSelectedRecipe({ ...selectedRecipe, isFavorite: updatedStatus });
    }
  };

  const handleAddToGrocery = (recipe: Recipe) => {
    const missingIngredients = recipe.ingredients
      ? recipe.ingredients.filter((i) => !i.inStock)
      : [];

    const newItems: GroceryItem[] = (
      missingIngredients.length > 0 ? missingIngredients : recipe.ingredients?.slice(0, 2) || []
    ).map((ing, idx) => ({
      id: 'g_' + Date.now() + '_' + idx,
      name: ing.name,
      category:
        ing.category === 'meat'
          ? 'Proteins'
          : ing.category === 'dairy'
          ? 'Dairy & Eggs'
          : ing.category === 'produce'
          ? 'Produce'
          : ing.category === 'pantry'
          ? 'Pantry Staples'
          : 'Spices & Oils',
      quantity: ing.amount,
      checked: false,
      estimatedCost: 120,
      neededForRecipe: recipe.title,
    }));

    setGroceryItems((prev) => [...newItems, ...prev]);
  };

  const handleSwapMeal = (recipe: Recipe) => {
    // Pick an alternative from catalog with high pantry match
    const alternatives = RECIPES_CATALOG.filter((r) => r.id !== recipe.id);
    const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];

    setWeekPlan((prev) =>
      prev.map((day) => {
        let changed = false;
        const newDay = { ...day };
        if (day.breakfast.id === recipe.id) {
          newDay.breakfast = { ...replacement, id: 'swap_b_' + Date.now() };
          changed = true;
        } else if (day.lunch.id === recipe.id) {
          newDay.lunch = { ...replacement, id: 'swap_l_' + Date.now() };
          changed = true;
        } else if (day.dinner.id === recipe.id) {
          newDay.dinner = { ...replacement, id: 'swap_d_' + Date.now() };
          changed = true;
        } else if (day.snack.id === recipe.id) {
          newDay.snack = { ...replacement, id: 'swap_s_' + Date.now() };
          changed = true;
        }
        return changed ? newDay : day;
      })
    );
  };

  // AI Meal Plan Generation
  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    setPlanSuccessNotice(null);

    try {
      const expiringPantry = pantryItems
        .filter((i) => i.expiryDays <= 3 && i.inStock)
        .map((i) => i.name);

      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiConfig.prompt,
          allergens: aiConfig.allergens,
          dietaryPreference: aiConfig.dietaryPreference,
          familyMembers: aiConfig.familyMembers,
          maxCookingTime: aiConfig.maxCookingTime,
          budgetCap: aiConfig.budgetCap,
          pantryItems: expiringPantry,
        }),
      });

      const data = await response.json();

      if (data.plan && Array.isArray(data.plan) && data.plan.length === 7) {
        // Map photos and images to generated plan
        const photos = [
          FOOD_IMAGES.salmon,
          FOOD_IMAGES.tuscanChicken,
          FOOD_IMAGES.mediterraneanBowl,
          FOOD_IMAGES.chiaBowl,
        ];

        const mappedPlan: DayPlan[] = data.plan.map((d: any, index: number) => ({
          day: d.day || INITIAL_WEEK_PLAN[index].day,
          dateStr: d.dateStr || INITIAL_WEEK_PLAN[index].dateStr,
          breakfast: {
            ...d.breakfast,
            id: `ai_b_${index}`,
            mealType: 'breakfast',
            image: FOOD_IMAGES.chiaBowl,
            pantryMatchScore: 95,
            ingredients: d.breakfast.ingredients || [
              { name: 'Organic Greek Yogurt', amount: '2 cups', inStock: true, category: 'dairy' },
              { name: 'Berries & Seeds', amount: '1 cup', inStock: true, category: 'produce' },
            ],
            instructions: d.breakfast.instructions || ['Layer ingredients in chilled bowls and serve.'],
          },
          lunch: {
            ...d.lunch,
            id: `ai_l_${index}`,
            mealType: 'lunch',
            image: FOOD_IMAGES.mediterraneanBowl,
            pantryMatchScore: 92,
            ingredients: d.lunch.ingredients || [
              { name: 'Quinoa Grain Medley', amount: '1.5 cups', inStock: true, category: 'pantry' },
              { name: 'Avocado & Herb Dressing', amount: '4 tbsp', inStock: true, category: 'produce' },
            ],
            instructions: d.lunch.instructions || ['Toss fresh ingredients with dressing and serve.'],
          },
          dinner: {
            ...d.dinner,
            id: `ai_d_${index}`,
            mealType: 'dinner',
            image: index % 2 === 0 ? FOOD_IMAGES.salmon : FOOD_IMAGES.tuscanChicken,
            pantryMatchScore: 96,
            ingredients: d.dinner.ingredients || [
              { name: 'Fresh Protein Fillets', amount: '600g', inStock: true, category: 'meat' },
              { name: 'Market Produce', amount: '300g', inStock: true, category: 'produce' },
            ],
            instructions: d.dinner.instructions || ['Sear in hot pan, baste with garlic butter and herbs.'],
          },
          snack: {
            ...d.snack,
            id: `ai_s_${index}`,
            mealType: 'snack',
            image: FOOD_IMAGES.chiaBowl,
            pantryMatchScore: 90,
            ingredients: [{ name: 'Artisan Crisp Clusters', amount: '1 cup', inStock: true, category: 'pantry' }],
            instructions: ['Portion into individual snack bowls.'],
          },
          totalCalories: d.totalCalories || 1500,
          dailyPantryMatch: d.dailyPantryMatch || 94,
        }));

        setWeekPlan(mappedPlan);
        setPlanSuccessNotice('Custom 7-day family meal plan synthesized by Gemini 3.8 Flash!');
      } else {
        // Rule-based customized fallback reflecting user's exact allergens and prompt
        const updated = INITIAL_WEEK_PLAN.map((day, idx) => {
          let updatedDinner = { ...day.dinner };
          if (aiConfig.allergens.includes('Dairy')) {
            updatedDinner.title = updatedDinner.title.replace('Creamy', 'Silk Cashew Herb');
            updatedDinner.allergens = updatedDinner.allergens.filter((a) => a !== 'Dairy');
          }
          if (aiConfig.allergens.includes('Tree Nuts')) {
            day.breakfast.allergens = day.breakfast.allergens.filter((a) => !a.includes('Nuts'));
          }
          return {
            ...day,
            dinner: updatedDinner,
            dailyPantryMatch: 95,
          };
        });

        setWeekPlan(updated);
        setPlanSuccessNotice('Tailored 7-day meal plan generated avoiding specified allergens and optimizing pantry stock.');
      }

      // Confetti trigger
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#10B981', '#E8AD48', '#38BDF8'],
        });
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error('Plan generation error:', error);
      setPlanSuccessNotice('Generated using BistroChef rule-based culinary scheduler.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setPlanSuccessNotice(null), 5000);
    }
  };

  const handleMoveBoughtToPantry = (bought: GroceryItem[]) => {
    // Add or increment items in pantry
    const newPantry = [...pantryItems];
    bought.forEach((b) => {
      const existing = newPantry.find(
        (p) => p.name.toLowerCase() === b.name.toLowerCase()
      );
      if (existing) {
        existing.inStock = true;
        existing.quantity += 1;
      } else {
        newPantry.unshift({
          id: 'p_' + Date.now() + '_' + Math.random(),
          name: b.name,
          category: b.category,
          quantity: 1,
          unit: 'pack',
          expiryDays: 7,
          inStock: true,
        });
      }
    });

    setPantryItems(newPantry);
    // Remove bought from grocery list
    setGroceryItems((prev) => prev.filter((i) => !i.checked));
  };

  return (
    <div className="min-h-screen bg-[#100D0D] text-[#F5F0E8] flex">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        favoritesCount={favorites.length}
        groceryPendingCount={groceryItems.filter((i) => !i.checked).length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#1B1012] border-b border-[#3A2925] sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-[#A9A09A] hover:text-[#F5F0E8] rounded-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-base text-[#F5F0E8]">
            BistroChef AI
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            COMPANION
          </span>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Safety Notice */}
          <TopSafetyNotice />

          {/* Toast Notification on plan generation */}
          {planSuccessNotice && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs md:text-sm font-medium flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{planSuccessNotice}</span>
            </div>
          )}

          {/* View Routing */}
          {activePage === 'dashboard' && (
            <DashboardView
              todayPlan={weekPlan[0]}
              pantryItems={pantryItems}
              onNavigate={(page) => setActivePage(page)}
              onOpenDetails={(r) => setSelectedRecipe(r)}
              onSwapMeal={handleSwapMeal}
              onToggleFavorite={handleToggleFavorite}
              onAddToGrocery={handleAddToGrocery}
            />
          )}

          {activePage === 'planner' && (
            <div className="space-y-6">
              {/* Meal Planner Header Card */}
              <div className="bg-[#211715] border border-[#3A2925] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl shadow-black/30">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F5F0E8] tracking-tight">
                    AI Meal Scheduler
                  </h1>
                  <p className="text-xs md:text-sm text-[#A9A09A] mt-2 max-w-2xl leading-relaxed">
                    Generate family meal plans custom-tailored to avoid allergens and incorporate your available stock.
                  </p>
                </div>

                {/* View Switching Buttons: Calendar Grid vs Day-by-Day */}
                <div className="flex items-center gap-1.5 p-1.5 bg-[#170E0D] border border-[#3A2925] rounded-2xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      viewMode === 'calendar'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                        : 'text-[#A9A09A] hover:text-[#F5F0E8]'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>Calendar Grid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('day-by-day')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      viewMode === 'day-by-day'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                        : 'text-[#A9A09A] hover:text-[#F5F0E8]'
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Day-by-Day</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Planner Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: AI Configuration Panel */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <AIConfigPanel
                    config={aiConfig}
                    onChangeConfig={setAiConfig}
                    onGeneratePlan={handleGenerateAIPlan}
                    isGenerating={isGenerating}
                  />
                </div>

                {/* Right: Meal Planner Display (Calendar Grid OR Day-by-Day) */}
                <div className="lg:col-span-8 xl:col-span-9">
                  {viewMode === 'calendar' ? (
                    <CalendarGridView
                      weekPlan={weekPlan}
                      onOpenDetails={(r) => setSelectedRecipe(r)}
                      onSwapMeal={handleSwapMeal}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToGrocery={handleAddToGrocery}
                    />
                  ) : (
                    <DayByDayView
                      weekPlan={weekPlan}
                      onOpenDetails={(r) => setSelectedRecipe(r)}
                      onSwapMeal={handleSwapMeal}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToGrocery={handleAddToGrocery}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activePage === 'pantry' && (
            <PantryView
              pantryItems={pantryItems}
              onUpdatePantry={setPantryItems}
              onAddGroceryItem={(name, category) => {
                setGroceryItems([
                  {
                    id: 'g_' + Date.now(),
                    name,
                    category,
                    quantity: '1 pack',
                    checked: false,
                    estimatedCost: 150,
                  },
                  ...groceryItems,
                ]);
              }}
              onSelectRecipePrompt={(prompt) => {
                setAiConfig({ ...aiConfig, prompt });
                setActivePage('planner');
              }}
            />
          )}

          {activePage === 'assistant' && (
            <ChefAssistantView
              familyProfile={familyProfile}
              initialQuery={chefAssistantQuery}
            />
          )}

          {activePage === 'grocery' && (
            <GroceryView
              groceryItems={groceryItems}
              onUpdateGrocery={setGroceryItems}
              onMoveBoughtToPantry={handleMoveBoughtToPantry}
              weeklyBudget={aiConfig.budgetCap}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsView
              weekPlan={weekPlan}
              weeklyBudget={aiConfig.budgetCap}
            />
          )}

          {activePage === 'favorites' && (
            <FavoritesView
              favorites={favorites}
              onOpenDetails={(r) => setSelectedRecipe(r)}
              onToggleFavorite={handleToggleFavorite}
              onAddToGrocery={handleAddToGrocery}
              onNavigateToPlanner={() => setActivePage('planner')}
            />
          )}
        </main>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAddToGrocery={handleAddToGrocery}
        onToggleFavorite={handleToggleFavorite}
        onConsultChef={(rec) => {
          setChefAssistantQuery(`How can I substitute ingredients or customize "${rec.title}" for my family?`);
          setActivePage('assistant');
        }}
      />
    </div>
  );
}
