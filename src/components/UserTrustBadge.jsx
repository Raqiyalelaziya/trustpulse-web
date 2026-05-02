import { BadgeCheck, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const trustConfig = {
  High: {
    icon: BadgeCheck,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    label: 'Verified',
    showBadge: true,
  },
  Medium: {
    icon: Star,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    label: 'Trusted',
    showBadge: false,
  },
  Normal: {
    icon: Zap,
    color: 'text-gray-500 bg-gray-50 border-gray-200',
    label: 'Member',
    showBadge: false,
  },
};

export default function UserTrustBadge({ trustLevel = 'Normal', size = 'md' }) {
  const config = trustConfig[trustLevel] || trustConfig.Normal;
  const Icon = config.icon;
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border font-medium', config.color, sizes[size])}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      {config.label}
    </span>
  );
}