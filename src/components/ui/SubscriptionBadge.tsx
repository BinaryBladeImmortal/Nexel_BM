import { cn } from '@/lib/utils';
import { Check, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

type PlanName = 'Free' | 'Starter' | 'Pro' | 'Power' | 'Ultra';

const planColors = {
  Free: 'bg-gray-100 text-gray-800',
  Starter: 'bg-blue-100 text-blue-800',
  Pro: 'bg-purple-100 text-purple-800',
  Power: 'bg-yellow-100 text-yellow-800',
  Ultra: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
};

const planIcons = {
  Free: null,
  Starter: <Zap className="w-3 h-3 mr-1" />,
  Pro: <Zap className="w-3 h-3 mr-1" />,
  Power: <Zap className="w-3 h-3 mr-1" />,
  Ultra: <Crown className="w-3 h-3 mr-1" />,
};

interface SubscriptionBadgeProps {
  plan: PlanName;
  className?: string;
  showIcon?: boolean;
  showCheckmark?: boolean;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  plan,
  className,
  showIcon = true,
  showCheckmark = false,
}) => {
  const { subscription } = useSubscription();
  const isCurrentPlan = subscription.plan === plan;
  const isHigherPlan = getPlanLevel(subscription.plan) > getPlanLevel(plan);

  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        planColors[plan],
        isCurrentPlan && 'ring-2 ring-offset-2 ring-offset-background ring-primary',
        className
      )}
    >
      {showIcon && planIcons[plan]}
      {plan}
      {showCheckmark && (isCurrentPlan || isHigherPlan) && (
        <Check className="w-3 h-3 ml-1" />
      )}
    </div>
  );
};

// Helper function to get plan level (0 for Free, 1 for Starter, etc.)
function getPlanLevel(plan: PlanName): number {
  const levels: Record<PlanName, number> = {
    'Free': 0,
    'Starter': 1,
    'Pro': 2,
    'Power': 3,
    'Ultra': 4,
  };
  return levels[plan] || 0;
}
