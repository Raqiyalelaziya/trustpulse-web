import { Link } from 'react-router-dom';
import { Star, Zap, ShieldCheck, Sparkles, ArrowRight, Store, MessageSquare, Trophy, Compass } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Store,
    title: 'Find or Add a Shop',
    description: 'Search for any social media shop — Instagram, TikTok, Facebook, and more. If it\'s not listed, add it in seconds.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    link: '/search',
    cta: 'Browse Shops',
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Write a Review',
    description: 'Share your real experience. Upload purchase photos to get a "Verified" badge and earn extra points.',
    color: 'from-primary to-primary/70',
    bg: 'bg-primary/5 border-primary/20',
    iconColor: 'text-primary',
    link: '/add-review',
    cta: 'Write Review',
  },
  {
    step: '03',
    icon: Trophy,
    title: 'Earn Points & Build Trust',
    description: 'Every review earns points. The more you contribute, the higher your trust level — unlocking bigger rewards.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    link: '/profile',
    cta: 'View Profile',
  },
  {
    step: '04',
    icon: Compass,
    title: 'Get Smart Recommendations',
    description: 'Based on your reviews and browsing habits, we suggest trusted shops tailored to your taste.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 border-violet-200',
    iconColor: 'text-violet-600',
    link: '/search',
    cta: 'Explore Now',
  },
];

const trustLevels = [
  { level: 'Normal', engagement: '0+', pts: '+10/review', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' },
  { level: 'Medium', engagement: '30+', pts: '+15/review', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  { level: 'High', engagement: '150+', pts: '+20/review', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', badge: '✓ Verified' },
];

export default function HowItWorks() {
  return (
    <section className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          How TrustPulse Works
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-extrabold">
          Your journey to smarter shopping
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
          A community-powered platform that collects reviews, rewards contributors, builds trust profiles, and recommends the best shops for you.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className={`relative rounded-2xl border p-5 space-y-4 ${s.bg} transition-all hover:shadow-lg hover:-translate-y-1 duration-300`}>
              {/* Step number */}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold font-heading text-muted-foreground/20">{s.step}</span>
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-base">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
              <Link
                to={s.link}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.iconColor} hover:underline`}
              >
                {s.cta} <ArrowRight className="h-3 w-3" />
              </Link>
              {/* Connector arrow (not last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Level Rewards */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-accent fill-accent" />
          <h3 className="font-heading font-bold text-lg">Trust Level Rewards System</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          The more the community engages with your reviews (likes + comments), the higher your trust level — and the more points you earn per review.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trustLevels.map((tl) => (
            <div key={tl.level} className={`rounded-xl border p-4 space-y-2 ${tl.color}`}>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${tl.dot}`} />
                <span className="font-semibold text-sm">{tl.level}</span>
                {tl.badge && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">{tl.badge}</span>}
              </div>
              <p className="text-xs opacity-80">{tl.engagement} engagement score</p>
              <p className="text-sm font-bold">{tl.pts}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verified Review (with photo): extra points
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-accent" />
            Each like received: +2–5 pts depending on level
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/add-review" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            <MessageSquare className="h-4 w-4" /> Write a Review Now
          </Link>
          <Link to="/add-shop" className="inline-flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
            <Store className="h-4 w-4" /> Add a Shop
          </Link>
        </div>
      </div>
    </section>
  );
}