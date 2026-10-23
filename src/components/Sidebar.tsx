import React from 'react';
import {
  ChefHat,
  LayoutDashboard,
  CalendarDays,
  Package,
  Bot,
  ShoppingCart,
  PieChart,
  Heart,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ActivePage } from '../types/mealPlanner';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  favoritesCount: number;
  groceryPendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
  favoritesCount,
  groceryPendingCount,
}) => {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner' as ActivePage, label: 'Meal Planner', icon: CalendarDays },
    { id: 'pantry' as ActivePage, label: 'Pantry Stock', icon: Package },
    { id: 'assistant' as ActivePage, label: 'AI Assistant', icon: Bot, badge: 'Gemini' },
    { id: 'grocery' as ActivePage, label: 'Grocery List', icon: ShoppingCart, count: groceryPendingCount },
    { id: 'analytics' as ActivePage, label: 'Analytics', icon: PieChart },
    { id: 'favorites' as ActivePage, label: 'Saved Favorites', icon: Heart, count: favoritesCount },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col bg-[#1B1012] border-r border-[#3A2925] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between p-6 border-b border-[#3A2925]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold tracking-tight text-[#F5F0E8]">
                  BistroChef
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-sans tracking-wider uppercase text-[#A9A09A]">
                AI COMPANION
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-[#A9A09A] hover:text-[#F5F0E8] rounded-lg lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 to-emerald-500/5 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/40 font-semibold'
                    : 'text-[#A9A09A] hover:text-[#F5F0E8] hover:bg-[#211715]/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-[#A9A09A] group-hover:text-amber-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#211715] text-[#F5F0E8] border border-[#3A2925]">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Family Dining Profile snippet */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-[#211715]/70 border border-[#3A2925] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F5F0E8] font-serif">
              Family Dining Profile
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> Allergen-Protected
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#A9A09A]">
            <span>Members: 4 (2 adults, 2 kids)</span>
            <span className="text-[#E8AD48] font-mono">₹3,500/wk</span>
          </div>

          <div className="pt-2 border-t border-[#3A2925]/60 flex items-center justify-between text-[11px] text-[#A9A09A]">
            <span>Pantry Readiness</span>
            <span className="font-mono text-emerald-400 font-semibold">94%</span>
          </div>
          <div className="w-full bg-[#140F0E] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[94%]" />
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-[#3A2925]/60 flex items-center gap-2 text-xs text-[#A9A09A]">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">Powered by Gemini 3.8 Flash</span>
        </div>
      </aside>
    </>
  );
};
