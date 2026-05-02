import { ShieldCheck, ShieldAlert, ShieldQuestion, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const trustConfig = {
  High: { icon: ShieldCheck, color: 'text-trust-high bg-trust-high/10 border-trust-high/20', label: 'High Trust' },
  Medium: { icon: ShieldAlert, color: 'text-trust-medium bg-trust-medium/10 border-trust-medium/20', label: 'Medium Trust' },
  Low: { icon: ShieldQuestion, color: 'text-trust-low bg-trust-low/10 border-trust-low/20', label: 'Low Trust' },
  New: { icon: Shield, color: 'text-trust-new bg-trust-new/10 border-trust-new/20', label: 'New Shop' },
};

export default function TrustBadge({ level = 'New', size = 'md' }) {
  const config = trustConfig[level] || trustConfig.New;
  const Icon = config.icon;
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border font-medium', config.color, sizes[size])}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      {config.label}
    </span>
  );
}