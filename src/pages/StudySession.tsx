import React, { useState } from 'react';
import { DocumentUpload } from '@/components/study/DocumentUpload';
import { PomodoroTimer } from '@/components/study/PomodoroTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Brain, Settings, FileText } from 'lucide-react';

export function StudySession() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  const handleUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mockDocuments = [
    { id: '1', title: 'Biology Chapter 12', progress: 75, pages: 45, currentPage: 34 },
    { id: '2', title: 'Calculus Notes', progress: 60, pages: 28, currentPage: 17 },
    { id: '3', title: 'History Review', progress: 90, pages: 52, currentPage: 47 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Session</h1>
          <p className="text-gray-600 mt-1">
            Upload documents and start a focused study session
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Total today: 2h 15m
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Management */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Documents</TabsTrigger>
              <TabsTrigger value="library">My Library</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <DocumentUpload
                onUpload={handleUpload}
                uploadedFiles={uploadedFiles}
                onRemove={handleRemoveFile}
              />
            </TabsContent>
            
            <TabsContent value="library" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Your Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDocuments.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedDocument(null)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{doc.title}</h3>
                        <p className="text-sm text-gray-600">
                          Page {doc.currentPage} of {doc.pages}
                        </p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${doc.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {doc.progress}% complete
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Read
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Document Viewer Placeholder */}
          {selectedDocument && (
            <Card>
              <CardHeader>
                <CardTitle>Document Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Document viewer will be implemented here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF rendering with progress tracking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Study Timer and Controls */}
        <div className="space-y-6">
          <PomodoroTimer />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Need help understanding the material? Ask your AI tutor for explanations and clarifications.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Ask a Question
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Summarize Section
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Quiz Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pomodoros Today</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Focus Time</span>
                <span className="font-medium">2h 15m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quiz Average</span>
                <span className="font-medium">88%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pages Read</span>
                <span className="font-medium">23</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}