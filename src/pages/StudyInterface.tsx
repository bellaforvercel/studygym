import React, { useState } from 'react';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { DocumentViewer } from '@/components/study/DocumentViewer';
import { StudyDashboard } from '@/components/study/StudyDashboard';
import { ComprehensionModal } from '@/components/study/ComprehensionModal';

export function StudyInterface() {
  const [isZenMode, setIsZenMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showComprehensionModal, setShowComprehensionModal] = useState(false);
  const [currentDocument] = useState({
    title: 'Biology Chapter 12: Genetics and Heredity',
    type: 'PDF Document',
    content: 'Sample content...'
  });

  const handleComprehensionComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    // Handle quiz completion logic here
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <TopNavigation
        currentDocument={currentDocument.title}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <DocumentViewer 
          document={currentDocument}
          isZenMode={isZenMode}
        />
        
        <StudyDashboard
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isZenMode={isZenMode}
        />
      </div>

      <ComprehensionModal
        isOpen={showComprehensionModal}
        onClose={() => setShowComprehensionModal(false)}
        onComplete={handleComprehensionComplete}
      />
    </div>
  );
}