import React from 'react';
import { StudyRoom } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Clock, BookOpen } from 'lucide-react';

interface StudyRoomCardProps {
  room: StudyRoom;
  onJoin: (roomId: string) => void;
}

export function StudyRoomCard({ room, onJoin }: StudyRoomCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{room.description}</p>
          </div>
          <Badge variant={room.isActive ? "default" : "secondary"}>
            {room.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{room.participants.length}/{room.maxParticipants}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Created {new Date(room.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {room.currentDocument && (
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Currently reading: {room.currentDocument.title}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {room.participants.slice(0, 4).map((participant, index) => (
              <Avatar key={participant.id} className="w-6 h-6 border-2 border-white">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {room.participants.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{room.participants.length - 4}</span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => onJoin(room.id)}
            disabled={room.participants.length >= room.maxParticipants}
          >
            Join Room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}