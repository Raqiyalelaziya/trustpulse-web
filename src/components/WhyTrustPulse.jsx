import { motion } from 'framer-motion';
import { ShieldCheck, Search, Star, Users, Zap, BadgeCheck } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Shop Safer',
    description: 'Verified reviews and proof of purchase mean you can trust what you read.',
    color: 'text-trust-high bg-trust-high/10',
  },
  {
    icon: Search,
    title: 'Discover Quality',
    description: 'Find the best social media shops across fashion, beauty, electronics & more.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Star,
    title: 'Earn Rewards',
    description: 'Write reviews, upload proof, and earn points to level up your trust rank.',
    color: 'text-accent bg-accent/10',
  },
  {
    icon: Users,
    title: 'Join a Community',
    description: 'Thousands of shoppers helping each other avoid scams and find great deals.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Real-Time Insights',
    description: 'Live feed of new reviews and trending shops keeps you always in the know.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Reviewers',
    description: 'Our badge system rewards top contributors who consistently help others.',
    color: 'text-pink-600 bg-pink-50',
  },
];

export default function WhyTrustPulse() {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-heading text-2xl font-bold">Why TrustPulse?</h2>
        <p className="text-muted-foreground text-sm mt-1">Built for smart shoppers, by the community</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-card border border-border/50 rounded-2xl p-5 flex gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`h-11 w-11 rounded-xl ${b.color} flex items-center justify-center shrink-0`}>
              <b.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm mb-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}