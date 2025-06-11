import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Users, Trophy } from 'lucide-react';

export function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and Features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">StudyFlow</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              AI-Powered Study Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Transform your learning with intelligent study sessions, collaborative rooms, and personalized AI assistance.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
                <p className="text-sm text-gray-600">Get instant explanations and answers while studying</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Study Rooms</h3>
                <p className="text-sm text-gray-600">Collaborate with peers in virtual study sessions</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Documents</h3>
                <p className="text-sm text-gray-600">Upload and interact with your study materials</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your learning journey and achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600">
                Sign in to continue your learning journey
              </p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignIn 
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
      </div>
    </div>
  );
}