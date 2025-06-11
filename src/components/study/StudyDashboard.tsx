import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Trophy,
  Clock,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyDashboardProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isZenMode: boolean;
}

export function StudyDashboard({ isCollapsed, onToggleCollapse, isZenMode }: StudyDashboardProps) {
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(25 * 60); // 25 minutes
  const [currentPhase, setCurrentPhase] = React.useState<'focus' | 'break'>('focus');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeRemaining) / (25 * 60)) * 100;

  const studyRoomParticipants = [
    { id: '1', name: 'Alex', avatar: '', status: 'active' },
    { id: '2', name: 'Sarah', avatar: '', status: 'active' },
    { id: '3', name: 'Mike', avatar: '', status: 'idle' },
    { id: '4', name: 'Emma', avatar: '', status: 'active' },
    { id: '5', name: 'John', avatar: '', status: 'away' },
    { id: '6', name: 'Lisa', avatar: '', status: 'active' },
  ];

  const leaderboard = [
    { id: '1', name: 'Sarah Chen', avatar: '', score: 2840, time: '12h 30m', pages: 156 },
    { id: '2', name: 'Alex Johnson', avatar: '', score: 2650, time: '11h 45m', pages: 142 },
    { id: '3', name: 'Mike Wilson', avatar: '', score: 2420, time: '10h 20m', pages: 128 },
    { id: '4', name: 'Emma Davis', avatar: '', score: 2180, time: '9h 15m', pages: 115 },
    { id: '5', name: 'John Smith', avatar: '', score: 1950, time: '8h 30m', pages: 98 },
  ];

  if (isZenMode) return null;

  return (
    <div className={cn(
      "bg-white border-l border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
      isCollapsed ? "w-12" : "w-80"
    )}>
      {/* Toggle Button */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Focus Timer */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {currentPhase}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={cn(
                    "transition-all duration-200 hover:scale-105",
                    isTimerRunning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {isTimerRunning ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setTimeRemaining(25 * 60);
                    setIsTimerRunning(false);
                  }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Session Info */}
              <div className="text-center text-sm text-gray-600">
                Session 3 of 4 • 2 completed today
              </div>
            </CardContent>
          </Card>

          {/* Virtual Study Room */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Study Room
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {studyRoomParticipants.filter(p => p.status === 'active').length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                Biology Study Group • 6 participants
              </div>
              
              {/* Avatar Grid */}
              <div className="grid grid-cols-4 gap-3">
                {studyRoomParticipants.map((participant) => (
                  <div 
                    key={participant.id} 
                    className="relative group cursor-pointer transition-transform hover:scale-110"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs">
                        {participant.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                      participant.status === 'active' && "bg-green-500",
                      participant.status === 'idle' && "bg-yellow-500",
                      participant.status === 'away' && "bg-gray-400"
                    )} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {participant.name} • {participant.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={cn(
                    "flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer",
                    index === 0 && "bg-yellow-50 border border-yellow-200"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 && "bg-yellow-500 text-white",
                      index === 1 && "bg-gray-400 text-white",
                      index === 2 && "bg-orange-600 text-white",
                      index > 2 && "bg-gray-200 text-gray-600"
                    )}>
                      {index === 0 ? <Trophy className="w-3 h-3" /> : index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.time} • {user.pages} pages
                    </div>
                  </div>
                  
                  <div className="text-sm font-bold text-blue-600">
                    {user.score.toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}