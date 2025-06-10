import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConvexContextProvider } from '@/contexts/ConvexContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { StudyProvider } from '@/contexts/StudyContext';
import { StudyInterface } from '@/pages/StudyInterface';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <ConvexContextProvider>
      <AuthProvider>
        <StudyProvider>
          <Router>
            <Routes>
              <Route path="/study" element={<StudyInterface />} />
              <Route path="/" element={<Navigate to="/study\" replace />} />
              <Route path="*" element={<Navigate to="/study\" replace />} />
            </Routes>
            <Toaster />
          </Router>
        </StudyProvider>
      </AuthProvider>
    </ConvexContextProvider>
  );
}

export default App;