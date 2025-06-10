import React, { useState } from 'react';
import { StudyRoomCard } from '@/components/study/StudyRoomCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Zap } from 'lucide-react';
import { StudyRoom, User } from '@/types';

export function StudyRooms() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockUsers: User[] = [
    { id: '1', email: 'alex@example.com', name: 'Alex Johnson', studyStreak: 5, totalStudyTime: 120, level: 2, createdAt: new Date() },
    { id: '2', email: 'sam@example.com', name: 'Sam Wilson', studyStreak: 3, totalStudyTime: 90, level: 1, createdAt: new Date() },
    { id: '3', email: 'emma@example.com', name: 'Emma Davis', studyStreak: 8, totalStudyTime: 200, level: 3, createdAt: new Date() },
  ];

  const mockRooms: StudyRoom[] = [
    {
      id: '1',
      name: 'AP Biology Study Group',
      description: 'Preparing for the AP Biology exam together. Currently focusing on genetics and evolution.',
      createdBy: '1',
      participants: mockUsers.slice(0, 3),
      isActive: true,
      createdAt: new Date('2024-01-15'),
      maxParticipants: 15,
      currentDocument: {
        id: '1',
        userId: '1',
        title: 'Campbell Biology Chapter 12',
        fileName: 'biology-ch12.pdf',
        fileSize: 2048000,
        uploadedAt: new Date(),
        readingProgress: 45,
        tags: ['biology', 'genetics'],
        subject: 'Biology'
      }
    },
    {
      id: '2',
      name: 'SAT Math Prep Sessions',
      description: 'Daily practice sessions for SAT Math. All skill levels welcome!',
      createdBy: '2',
      participants: mockUsers.slice(0, 2),
      isActive: true,
      createdAt: new Date('2024-01-20'),
      maxParticipants: 10,
    },
    {
      id: '3',
      name: 'World History Finals',
      description: 'Cramming for world history finals. Focus on 19th and 20th century events.',
      createdBy: '3',
      participants: [mockUsers[2]],
      isActive: false,
      createdAt: new Date('2024-01-22'),
      maxParticipants: 12,
    },
    {
      id: '4',
      name: 'Chemistry Lab Reports',
      description: 'Help each other with chemistry lab reports and problem sets.',
      createdBy: '1',
      participants: mockUsers.slice(1),
      isActive: true,
      createdAt: new Date('2024-01-25'),
      maxParticipants: 8,
    }
  ];

  const filteredRooms = mockRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinRoom = (roomId: string) => {
    console.log('Joining room:', roomId);
    // TODO: Implement room joining logic
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Rooms</h1>
          <p className="text-gray-600 mt-1">
            Join others in focused study sessions and stay motivated together
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Active Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">84</p>
                <p className="text-sm text-gray-600">Students Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-sm text-gray-600">Study Sessions Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search study rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            All Subjects
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            Active Only
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            Available Spots
          </Badge>
        </div>
      </div>

      {/* Study Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <StudyRoomCard
            key={room.id}
            room={room}
            onJoin={handleJoinRoom}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No study rooms found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or create a new study room
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Room
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}