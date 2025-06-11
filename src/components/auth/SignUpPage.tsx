import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Target, Zap } from 'lucide-react';

export function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Sign Up Form */}
        <div className="flex justify-center order-2 lg:order-1">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Join StudyFlow
              </CardTitle>
              <p className="text-gray-600">
                Start your personalized learning journey today
              </p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 w-full",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
                    socialButtonsBlockButtonText: "font-medium",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                    footerActionLink: "text-blue-600 hover:text-blue-700",
                  }
                }}
                redirectUrl="/study"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right side - Benefits and Features */}
        <div className="space-y-8 order-1 lg:order-2">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">StudyFlow</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Supercharge Your Learning
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who are already accelerating their academic success with AI-powered study tools.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Personalized AI Tutoring</h3>
                <p className="text-sm text-gray-600">Get instant, contextual explanations tailored to your learning style and pace</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Focus & Productivity</h3>
                <p className="text-sm text-gray-600">Pomodoro timers, distraction-free modes, and progress tracking to maximize your study efficiency</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Comprehension Checks</h3>
                <p className="text-sm text-gray-600">AI-generated quizzes and assessments to reinforce your understanding in real-time</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100 mb-4">Students already studying smarter</div>
              <div className="flex justify-center space-x-6 text-sm">
                <div>
                  <div className="font-semibold">4.9/5</div>
                  <div className="text-blue-200">Rating</div>
                </div>
                <div>
                  <div className="font-semibold">2M+</div>
                  <div className="text-blue-200">Study Hours</div>
                </div>
                <div>
                  <div className="font-semibold">95%</div>
                  <div className="text-blue-200">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}