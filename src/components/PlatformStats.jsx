import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Store, MessageSquare, Users } from 'lucide-react';

function CountUp({ target, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function PlatformStats() {
  const [stats, setStats] = useState({ shops: 0, reviews: 0, verified: 0, users: 0 });

  useEffect(() => {
    async function load() {
      const [shops, reviews] = await Promise.all([
        base44.entities.Shop.list('name', 1000),
        base44.entities.Review.list('-created_date', 1000),
      ]);
      let userCount = 0;
      try {
        const users = await base44.entities.User.list('-created_date', 1000);
        userCount = users.length;
      } catch {}
      setStats({
        shops: shops.length,
        reviews: reviews.length,
        verified: reviews.filter((r) => r.verified).length,
        users: userCount,
      });
    }
    load();
  }, []);

  const items = [
    { icon: Store, label: 'Shops Reviewed', value: stats.shops, color: 'text-primary bg-primary/10' },
    { icon: MessageSquare, label: 'Total Reviews', value: stats.reviews, color: 'text-accent bg-accent/10' },
    { icon: ShieldCheck, label: 'Verified Reviews', value: stats.verified, color: 'text-trust-high bg-trust-high/10' },
    { icon: Users, label: 'Community Members', value: stats.users, color: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <section className="bg-card rounded-3xl border border-border/50 p-8">
      <h2 className="font-heading text-2xl font-bold text-center mb-2">Our Impact</h2>
      <p className="text-center text-muted-foreground text-sm mb-8">Real numbers from a real community</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="text-center space-y-2">
            <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center mx-auto`}>
              <item.icon className="h-6 w-6" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-foreground">
              <CountUp target={item.value} />
            </p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}