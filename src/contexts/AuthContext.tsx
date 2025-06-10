import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock user for development - replace with Clerk integration
    const mockUser: User = {
      id: '1',
      email: 'student@example.com',
      name: 'Alex Johnson',
      studyStreak: 7,
      totalStudyTime: 1280, // minutes
      level: 3,
      createdAt: new Date('2024-01-15'),
    };
    
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    // TODO: Implement Clerk sign in
    console.log('Sign in:', email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // TODO: Implement Clerk sign up
    console.log('Sign up:', email, password, name);
  };

  const signOut = async () => {
    // TODO: Implement Clerk sign out
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}