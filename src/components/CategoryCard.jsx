import { Link } from 'react-router-dom';
import { Shirt, Cpu, Sparkles, Home, UtensilsCrossed, Dumbbell, BookOpen, Heart, Package, Watch, FlameKindling, Scissors } from 'lucide-react';

const categoryIcons = {
  Fashion: Shirt,
  Electronics: Cpu,
  Beauty: Sparkles,
  Accessories: Watch,
  Home: Home,
  Food: UtensilsCrossed,
  Perfume: FlameKindling,
  Handmade: Scissors,
  Health: Heart,
  Sports: Dumbbell,
  Books: BookOpen,
  Other: Package,
};

const categoryGradients = {
  Fashion: 'from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30',
  Electronics: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
  Beauty: 'from-purple-500/20 to-fuchsia-500/20 hover:from-purple-500/30 hover:to-fuchsia-500/30',
  Accessories: 'from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30',
  Home: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30',
  Food: 'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30',
  Perfume: 'from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30',
  Handmade: 'from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30',
  Health: 'from-teal-500/20 to-green-500/20 hover:from-teal-500/30 hover:to-green-500/30',
  Sports: 'from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30',
  Books: 'from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30',
  Other: 'from-gray-500/20 to-slate-500/20 hover:from-gray-500/30 hover:to-slate-500/30',
};

const categoryIconColors = {
  Fashion: 'text-pink-600',
  Electronics: 'text-blue-600',
  Beauty: 'text-purple-600',
  Accessories: 'text-yellow-600',
  Home: 'text-amber-600',
  Food: 'text-green-600',
  Perfume: 'text-violet-600',
  Handmade: 'text-orange-600',
  Health: 'text-teal-600',
  Sports: 'text-red-600',
  Books: 'text-indigo-600',
  Other: 'text-gray-600',
};

export default function CategoryCard({ category }) {
  const Icon = categoryIcons[category] || Package;

  return (
    <Link
      to={`/search?category=${encodeURIComponent(category)}`}
      className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${categoryGradients[category] || categoryGradients.Other} border border-border/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
    >
      <Icon className={`h-8 w-8 ${categoryIconColors[category] || 'text-gray-600'} transition-transform group-hover:scale-110`} />
      <span className="text-sm font-semibold text-card-foreground text-center">{category}</span>
    </Link>
  );
}