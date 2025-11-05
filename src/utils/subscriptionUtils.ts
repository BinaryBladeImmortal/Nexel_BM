import type { SubscriptionPlan } from '@/contexts/AuthContext';

const planLevels: Record<SubscriptionPlan, number> = {
  'Free': 0,
  'Starter': 1,
  'Pro': 2,
  'Power': 3,
  'Ultra': 4
};

export const hasAccess = (
  userPlan: SubscriptionPlan, 
  requiredPlan: SubscriptionPlan
): boolean => {
  return planLevels[userPlan] >= planLevels[requiredPlan];
};

export const getPlanLevel = (plan: SubscriptionPlan): number => {
  return planLevels[plan] || 0;
};

export const getPlanName = (level: number): SubscriptionPlan => {
  return (Object.entries(planLevels).find(([_, v]) => v === level)?.[0] || 'Free') as SubscriptionPlan;
};

export const getPlanFeatures = (plan: SubscriptionPlan): string[] => {
  const features: Record<SubscriptionPlan, string[]> = {
    'Free': [
      'Access to basic tutorials',
      'Community support',
      'Limited access to resources',
      'Basic learning paths'
    ],
    'Starter': [
      'All Free features',
      'Access to Starter tutorials',
      'Downloadable resources',
      'Email support',
      'Progress tracking'
    ],
    'Pro': [
      'All Starter features',
      'Access to Pro tutorials',
      'Priority support',
      'Advanced learning paths',
      'Exclusive webinars',
      'Certificate of completion'
    ],
    'Power': [
      'All Pro features',
      'Access to Power tutorials',
      '1:1 mentorship sessions',
      'Early access to new content',
      'Project reviews',
      'Job placement assistance'
    ],
    'Ultra': [
      'All Power features',
      'Access to all tutorials',
      '24/7 priority support',
      'Custom learning path',
      'Portfolio reviews',
      'Job guarantee program',
      'Exclusive community access'
    ]
  };

  return features[plan] || [];
};

export const getPlanPrice = (plan: SubscriptionPlan): { amount: string; period: string } => {
  const prices = {
    'Free': { amount: '0', period: 'forever' },
    'Starter': { amount: '499', period: 'month' },
    'Pro': { amount: '1,299', period: '3 months' },
    'Power': { amount: '2,399', period: '6 months' },
    'Ultra': { amount: '4,499', period: 'year' }
  };

  return prices[plan];
};
