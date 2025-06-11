import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PolarApi, Configuration } from '@polarsource/sdk';

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan: 'free' | 'premium' | 'pro';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

interface PaymentContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  createCheckoutSession: (planId: string) => Promise<string>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;
  isSubscribed: boolean;
  isPremium: boolean;
  isPro: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Initialize Polar SDK
const polarConfig = new Configuration({
  accessToken: import.meta.env.VITE_POLAR_ACCESS_TOKEN,
});
const polarApi = new PolarApi(polarConfig);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's subscription status
  useEffect(() => {
    if (isSignedIn && user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [isSignedIn, user]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      // Mock subscription data for development
      // Replace with actual Polar API call
      const mockSubscription: Subscription = {
        id: 'sub_mock_123',
        status: 'active',
        plan: 'free',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      };
      
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (planId: string): Promise<string> => {
    try {
      // Mock checkout URL for development
      // Replace with actual Polar checkout session creation
      const checkoutUrl = `https://polar.sh/checkout/${planId}?customer_id=${user?.id}`;
      return checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    try {
      if (!subscription) return;
      
      // Mock cancellation for development
      // Replace with actual Polar API call
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true,
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  const updateSubscription = async (planId: string) => {
    try {
      if (!subscription) return;
      
      // Mock subscription update for development
      // Replace with actual Polar API call
      const newPlan = planId.includes('premium') ? 'premium' : planId.includes('pro') ? 'pro' : 'free';
      setSubscription({
        ...subscription,
        plan: newPlan,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const isSubscribed = subscription?.status === 'active' && subscription?.plan !== 'free';
  const isPremium = subscription?.plan === 'premium';
  const isPro = subscription?.plan === 'pro';

  return (
    <PaymentContext.Provider value={{
      subscription,
      isLoading,
      createCheckoutSession,
      cancelSubscription,
      updateSubscription,
      isSubscribed,
      isPremium,
      isPro,
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}