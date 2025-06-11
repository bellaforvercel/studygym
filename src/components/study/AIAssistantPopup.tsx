import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  X, 
  MessageSquare, 
  BookOpen, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface AIAssistantPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function AIAssistantPopup({ selectedText, position, onClose }: AIAssistantPopupProps) {
  const [isTyping, setIsTyping] = useState(true);
  const [response, setResponse] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);

  const fullResponse = "This passage explains Mendel's fundamental laws of inheritance. The Law of Segregation means that each parent contributes one allele for each gene to their offspring. This is why you inherit one copy of each gene from your mother and one from your father.";

  useEffect(() => {
    // Simulate typing animation
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullResponse.length) {
        setResponse(fullResponse.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setShowFollowUp(true);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed z-50 w-80"
      style={{ 
        left: Math.max(20, Math.min(position.x - 160, window.innerWidth - 340)),
        top: Math.max(20, position.y - 10)
      }}
    >
      <Card className="shadow-lg border-blue-200 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-sm font-medium">
              <Brain className="w-4 h-4 mr-2 text-blue-600" />
              AI Assistant
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Selected Text */}
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 italic">
              "{selectedText.length > 100 ? selectedText.slice(0, 100) + '...' : selectedText}"
            </p>
          </div>

          {/* AI Response */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Explanation</span>
              {isTyping && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {response}
              {isTyping && <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>}
            </p>
          </div>

          {/* Follow-up Options */}
          {showFollowUp && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 font-medium">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Ask Question
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  More Examples
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Quiz Me
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}