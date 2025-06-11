import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Zap,
  Users,
  Brain,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingPlansProps {
  onPlanSelect?: (planId: string) => void;
}

export function PricingPlans({ onPlanSelect }: PricingPlansProps) {
  const { createCheckoutSession, subscription, isLoading } = usePayment();
  const { isSignedIn } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with AI-powered studying',
      icon: <FileText className="w-6 h-6" />,
      features: [
        '5 documents per month',
        'Basic AI explanations',
        '2 study rooms',
        'Basic progress tracking',
        'Community support'
      ],
      limitations: [
        'Limited AI interactions',
        'No advanced analytics',
        'No priority support'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      description: 'Unlock advanced features for serious students',
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        'Unlimited documents',
        'Advanced AI tutoring',
        'Unlimited study rooms',
        'Detailed analytics',
        'Priority support',
        'Custom study schedules',
        'Advanced quiz generation',
        'Export study reports'
      ],
      popular: true,
      buttonText: 'Start Premium',
      buttonVariant: 'default' as const,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      period: 'month',
      description: 'Everything you need for academic excellence',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Everything in Premium',
        'AI research assistant',
        'Collaborative workspaces',
        'Advanced integrations',
        'White-label options',
        'API access',
        'Custom AI models',
        'Dedicated support'
      ],
      popular: false,
      buttonText: 'Go Pro',
      buttonVariant: 'default' as const,
    },
  ];

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      onPlanSelect?.(planId);
      return;
    }

    if (!isSignedIn) {
      // Redirect to sign up
      window.location.href = '/sign-up';
      return;
    }

    try {
      const checkoutUrl = await createCheckoutSession(planId);
      window.open(checkoutUrl, '_blank');
      onPlanSelect?.(planId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const getCurrentPlan = () => {
    return subscription?.plan || 'free';
  };

  const isCurrentPlan = (planId: string) => {
    return getCurrentPlan() === planId;
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered studying with plans designed for every learner
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                "relative transition-all duration-300 hover:shadow-xl",
                plan.popular && "border-blue-500 shadow-lg scale-105",
                isCurrentPlan(plan.id) && "ring-2 ring-green-500"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center",
                  plan.id === 'free' && "bg-gray-100 text-gray-600",
                  plan.id === 'premium' && "bg-blue-100 text-blue-600",
                  plan.id === 'pro' && "bg-purple-100 text-purple-600"
                )}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== 'forever' && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  variant={plan.buttonVariant}
                  className={cn(
                    "w-full py-3 font-semibold transition-all duration-200",
                    plan.popular && "bg-blue-600 hover:bg-blue-700 text-white",
                    isCurrentPlan(plan.id) && "bg-green-600 hover:bg-green-700 text-white"
                  )}
                  disabled={isLoading || isCurrentPlan(plan.id)}
                >
                  {isCurrentPlan(plan.id) ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Feature Comparison
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">AI Features</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>Basic explanations</div>
                <div>Advanced tutoring</div>
                <div>Research assistant</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Collaboration</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>Basic study rooms</div>
                <div>Unlimited rooms</div>
                <div>Collaborative workspaces</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Analytics</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>Basic progress</div>
                <div>Detailed analytics</div>
                <div>Advanced insights</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">Support</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>Community support</div>
                <div>Priority support</div>
                <div>Dedicated support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}