import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  Maximize2
} from 'lucide-react';
import { AIAssistantPopup } from './AIAssistantPopup';

interface DocumentViewerProps {
  document?: {
    title: string;
    type: string;
    content: string;
  };
  isZenMode: boolean;
}

export function DocumentViewer({ document, isZenMode }: DocumentViewerProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(text);
      setSelectionPosition({ 
        x: rect.left + rect.width / 2, 
        y: rect.top - 10 
      });
      setShowAIPopup(true);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Document Toolbar */}
      {!isZenMode && (
        <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {document?.type || 'PDF Document'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{zoom}%</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleZoomOut}
              className="hover:bg-gray-100 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleZoomIn}
              className="hover:bg-gray-100 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Document Content */}
      <div className="flex-1 overflow-auto p-6">
        {document ? (
          <Card className="max-w-4xl mx-auto shadow-sm">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none leading-relaxed text-gray-800"
                style={{ fontSize: `${zoom}%` }}
                onMouseUp={handleTextSelection}
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Chapter 12: Genetics and Heredity
                </h1>
                
                <p className="mb-4">
                  Genetics is the branch of biology that studies heredity and the variation of inherited characteristics. 
                  The principles of genetics were first described by Gregor Mendel in the 19th century through his 
                  experiments with pea plants.
                </p>
                
                <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Mendel's Laws of Inheritance
                </h2>
                
                <p className="mb-4">
                  Mendel's work established three fundamental laws that govern inheritance:
                </p>
                
                <ol className="list-decimal list-inside mb-6 space-y-2">
                  <li><strong>Law of Segregation:</strong> Each parent has two copies of each gene, and only one copy is passed to each offspring.</li>
                  <li><strong>Law of Independent Assortment:</strong> Genes for different traits are inherited independently of each other.</li>
                  <li><strong>Law of Dominance:</strong> Some alleles are dominant over others in determining the phenotype.</li>
                </ol>
                
                <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  DNA Structure and Function
                </h2>
                
                <p className="mb-4">
                  Deoxyribonucleic acid (DNA) is the hereditary material in humans and almost all other organisms. 
                  DNA is made up of four types of nucleotides, each containing one of four bases: adenine (A), 
                  thymine (T), guanine (G), and cytosine (C).
                </p>
                
                <p className="mb-4">
                  The structure of DNA was first described by James Watson and Francis Crick in 1953. They proposed 
                  that DNA consists of two antiparallel strands wound around each other to form a double helix.
                </p>
                
                <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Gene Expression
                </h2>
                
                <p className="mb-4">
                  Gene expression is the process by which information from a gene is used to synthesize functional 
                  gene products, usually proteins. This process involves two main steps: transcription and translation.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No document selected
              </h3>
              <p className="text-gray-600">
                Upload a document to start studying
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Popup */}
      {showAIPopup && (
        <AIAssistantPopup
          selectedText={selectedText}
          position={selectionPosition}
          onClose={() => setShowAIPopup(false)}
        />
      )}
    </div>
  );
}