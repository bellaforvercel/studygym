import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComprehensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function ComprehensionModal({ isOpen, onClose, onComplete }: ComprehensionModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const questions: Question[] = [
    {
      id: 1,
      question: "According to Mendel's Law of Segregation, what happens to gene copies during reproduction?",
      options: [
        "Both copies are passed to each offspring",
        "Only one copy is passed to each offspring",
        "Gene copies are randomly mixed",
        "All copies are lost during reproduction"
      ],
      correctAnswer: 1,
      explanation: "The Law of Segregation states that each parent has two copies of each gene, but only one copy is passed to each offspring during reproduction."
    },
    {
      id: 2,
      question: "What are the four bases found in DNA?",
      options: [
        "A, T, G, C",
        "A, U, G, C", 
        "A, T, G, U",
        "T, G, C, U"
      ],
      correctAnswer: 0,
      explanation: "DNA contains four bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). RNA contains Uracil (U) instead of Thymine."
    },
    {
      id: 3,
      question: "Who first described the structure of DNA as a double helix?",
      options: [
        "Gregor Mendel",
        "Charles Darwin",
        "Watson and Crick",
        "Rosalind Franklin"
      ],
      correctAnswer: 2,
      explanation: "James Watson and Francis Crick first described the double helix structure of DNA in 1953, building on X-ray crystallography work by Rosalind Franklin."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and show results
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        answer === questions[index].correctAnswer
      ).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      setShowResults(true);
      setTimeout(() => {
        onComplete(score);
        onClose();
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctAnswers = selectedAnswers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  const score = Math.round((correctAnswers / questions.length) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Comprehension Check
          </DialogTitle>
          <DialogDescription>
            Test your understanding of the material you just studied
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress and Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <Progress 
                  value={((currentQuestion + 1) / questions.length) * 100} 
                  className="w-32"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all hover:bg-gray-50",
                        selectedAnswers[currentQuestion] === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                          selectedAnswers[currentQuestion] === index
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-300"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className={cn(
              "w-20 h-20 rounded-full mx-auto flex items-center justify-center",
              score >= 80 ? "bg-green-100" : score >= 60 ? "bg-yellow-100" : "bg-red-100"
            )}>
              {score >= 80 ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </h3>
              <p className="text-gray-600">
                You scored {correctAnswers} out of {questions.length} questions correctly
              </p>
            </div>
            
            <div className="text-4xl font-bold text-blue-600">
              {score}%
            </div>
            
            <Badge 
              variant="secondary" 
              className={cn(
                "text-sm px-4 py-2",
                score >= 80 && "bg-green-100 text-green-800",
                score >= 60 && score < 80 && "bg-yellow-100 text-yellow-800",
                score < 60 && "bg-red-100 text-red-800"
              )}
            >
              {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Studying!'}
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}