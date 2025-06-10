import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { StudyProvider } from '@/contexts/StudyContext';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { StudyInterface } from '@/pages/StudyInterface';
import { StudyRooms } from '@/pages/StudyRooms';
import { Progress } from '@/pages/Progress';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <Router>
          <Routes>
            <Route path="/study-interface" element={<StudyInterface />} />
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/study" element={<StudyInterface />} />
                  <Route path="/rooms" element={<StudyRooms />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/leaderboard" element={<div className="p-6"><h1 className="text-2xl font-bold">Leaderboard - Coming Soon</h1></div>} />
                  <Route path="/tutor" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Tutor - Coming Soon</h1></div>} />
                  <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
                </Routes>
              </Layout>
            } />
          </Routes>
          <Toaster />
        </Router>
      </StudyProvider>
    </AuthProvider>
  );
}

export default App;