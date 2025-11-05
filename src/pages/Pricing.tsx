import { useState } from "react";
import { Check, Zap, Star, Crown, Rocket, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CheckoutModal } from "@/components/CheckoutModal";

const Pricing = () => {
  const { user } = useAuth();
  const userPlan = user?.subscription?.plan || 'Free';
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: 499,
      duration: "month",
      description: "Perfect for beginners and small projects",
      features: [
        "5 GB storage",
        "Basic asset library",
        "Community support",
        "Limited to 10 exports/month",
        "Standard rendering"
      ],
      popular: false,
      buttonText: "Subscribe Now",
      color: "border-muted"
    },
    {
      name: "Pro",
      icon: Star,
      price: 1299,
      duration: "3 months",
      description: "For growing creators and professionals",
      features: [
        "20 GB storage",
        "Full asset library",
        "Priority support",
        "Unlimited exports",
        "4K rendering",
        "Early access to new features"
      ],
      popular: true,
      buttonText: "Get Pro",
      color: "border-primary"
    },
    {
      name: "Power",
      icon: Crown,
      price: 2399,
      duration: "6 months",
      description: "For serious creators and small teams",
      features: [
        "50 GB storage",
        "Premium asset pack",
        "24/7 priority support",
        "8K rendering",
        "Team collaboration",
        "Custom presets",
        "Monthly 1:1 training"
      ],
      popular: false,
      buttonText: "Go Power",
      color: "border-accent"
    },
    {
      name: "Ultra",
      icon: Rocket,
      price: 4499,
      duration: "12 months",
      description: "For professionals and studios",
      features: [
        "200 GB storage",
        "All asset packs included",
        "Dedicated account manager",
        "16K rendering",
        "Team workspace",
        "Custom development",
        "Priority feature requests",
        "Exclusive community access"
      ],
      popular: false,
      buttonText: "Go Ultra",
      color: "border-secondary"
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return `₹${plan.price.toLocaleString('en-IN')}`;
  };

  const calculateMonthlyEquivalent = (plan: typeof plans[0]) => {
    const months = parseInt(plan.duration);
    if (isNaN(months)) return null;
    const monthly = plan.price / months;
    return `(₹${Math.round(monthly)}/month)`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="pt-24 pb-16 cyber-grid">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold title-orbitron mb-6">
              NEXEL Pro Plans
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Unlock the full potential of NEXEL with our powerful subscription plans. 
              Choose the one that fits your creative workflow.
            </p>
            
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 max-w-2xl mx-auto mb-12">
              <p className="text-accent font-medium">
                🔥 Early Adopter Program: First 1,000 users get a lifetime discount and exclusive founder's asset pack.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Asset Packs available separately (₹99–₹799). ALTR Boosts for advanced AI tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              
              const isCurrentPlan = user && userPlan === plan.name;
              
              return (
                <div 
                  key={plan.name}
                  className={`relative gradient-border p-8 hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up ${
                    plan.popular ? 'ring-2 ring-primary ring-opacity-50' : ''
                  } ${
                    isCurrentPlan ? 'ring-2 ring-accent ring-opacity-70' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-2 bg-gradient-primary text-white rounded-full text-sm font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-2 bg-accent text-white rounded-full text-sm font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Current Plan
                      </div>
                    </div>
                  )}
                                    <div className="text-center mb-8">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold font-orbitron mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mb-2">
                      <span className="text-4xl font-bold font-orbitron title-orbitron">
                        {getPrice(plan)}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        / {plan.duration}
                      </span>
                    </div>
                    
                    {calculateMonthlyEquivalent(plan) && (
                      <div className="text-sm text-accent font-medium">
                        {calculateMonthlyEquivalent(plan)}
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                      isCurrentPlan
                        ? 'bg-accent/20 text-accent border-2 border-accent cursor-default'
                        : plan.popular 
                          ? 'bg-gradient-primary text-white hover:glow-primary hover:scale-105'
                          : 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:glow-primary'
                    }`}
                    disabled={isCurrentPlan}
                    onClick={() => {
                      if (!user) {
                        toast.info('Login required', {
                          description: 'Please login to subscribe to a plan'
                        });
                      } else if (!isCurrentPlan) {
                        setSelectedPlan(plan);
                        setCheckoutOpen(true);
                      }
                    }}
                  >
                    {isCurrentPlan ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Current Plan
                      </span>
                    ) : user ? (
                      `Upgrade to ${plan.name}`
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-orbitron font-bold title-orbitron mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="gradient-border p-6 hover:glow-primary transition-all duration-300">
              <h3 className="text-xl font-bold font-orbitron mb-3">
                Can I upgrade or downgrade my plan anytime?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can change your plan at any time. When upgrading, you'll be charged 
                the prorated amount immediately. When downgrading, the change takes effect 
                at your next billing cycle.
              </p>
            </div>
            
            <div className="gradient-border p-6 hover:glow-primary transition-all duration-300">
              <h3 className="text-xl font-bold font-orbitron mb-3">
                Do you offer student discounts?
              </h3>
              <p className="text-muted-foreground">
                Absolutely! Students get 50% off any paid plan. Just verify your student 
                status through our education program to unlock this discount.
              </p>
            </div>
            
            <div className="gradient-border p-6 hover:glow-primary transition-all duration-300">
              <h3 className="text-xl font-bold font-orbitron mb-3">
                What's included in commercial licenses?
              </h3>
              <p className="text-muted-foreground">
                All Creator plans and above include commercial licenses for downloaded assets. 
                This means you can use them in games you sell or commercial projects without 
                additional fees.
              </p>
            </div>
            
            <div className="gradient-border p-6 hover:glow-primary transition-all duration-300">
              <h3 className="text-xl font-bold font-orbitron mb-3">
                Is there a money-back guarantee?
              </h3>
              <p className="text-muted-foreground">
                Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not 
                satisfied, we'll refund your payment in full, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Pricing;