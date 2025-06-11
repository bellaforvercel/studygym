import React from 'react';
import { ConvexProvider } from "convex/react";
import { convex } from '@/lib/convex';

interface ConvexContextProviderProps {
  children: React.ReactNode;
}

export function ConvexContextProvider({ children }: ConvexContextProviderProps) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}