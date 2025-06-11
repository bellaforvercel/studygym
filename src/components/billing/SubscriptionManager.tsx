import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function SubscriptionManager() {
  const { subscription, cancelSubscription, isLoading } = usePayment();
  const { user } = useAuth();
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!subscription || subscription.plan === 'free') return;
    
    setIsCanceling(true);
    try {
      await cancelSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsCanceling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <Badge className={cn("capitalize", getPlanColor(subscription.plan))}>
                      {subscription.plan}
                    </Badge>
                    <Badge className={cn("capitalize", getStatusColor(subscription.status))}>
                      {subscription.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {subscription.plan === 'free' 
                      ? 'Free plan with basic features'
                      : `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} plan`
                    }
                  </p>
                </div>
                
                {subscription.plan !== 'free' && (
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${subscription.plan === 'premium' ? '9.99' : '19.99'}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                )}
              </div>

              {subscription.plan !== 'free' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Next billing date</span>
                    </div>
                    <span className="text-sm font-medium">
                      {format(subscription.currentPeriodEnd, 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Your subscription will be canceled on {format(subscription.currentPeriodEnd, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Billing
                    </Button>
                    
                    {!subscription.cancelAtPeriodEnd && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                      >
                        {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active subscription
              </h3>
              <p className="text-gray-600 mb-4">
                Upgrade to unlock premium features and enhance your learning experience
              </p>
              <Button>
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">42</div>
              <div className="text-sm text-gray-600">Documents Studied</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">128</div>
              <div className="text-sm text-gray-600">AI Interactions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24h</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-gray-600">Quizzes Taken</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-01-01', amount: '$9.99', status: 'paid', plan: 'Premium' },
              { date: '2023-12-01', amount: '$9.99', status: 'paid', plan: 'Premium' },
              { date: '2023-11-01', amount: '$9.99', status: 'paid', plan: 'Premium' },
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{invoice.plan} Plan</div>
                    <div className="text-xs text-gray-600">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{invoice.amount}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}