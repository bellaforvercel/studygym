import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudy } from '@/contexts/StudyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/progress/StatsCard';
import { PomodoroTimer } from '@/components/study/PomodoroTimer';
import { 
  Clock, 
  BookOpen, 
  Trophy, 
  Target, 
  Users,
  TrendingUp,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const { state, dispatch } = useStudy();

  const recentDocuments = [
    { id: '1', title: 'Biology Chapter 12: Genetics', progress: 75, lastRead: '2 hours ago' },
    { id: '2', title: 'World History: Industrial Revolution', progress: 45, lastRead: '1 day ago' },
    { id: '3', title: 'Calculus: Derivatives and Limits', progress: 90, lastRead: '3 days ago' },
  ];

  const activeRooms = [
    { id: '1', name: 'AP Biology Study Group', participants: 12, subject: 'Biology' },
    { id: '2', name: 'SAT Math Prep', participants: 8, subject: 'Mathematics' },
    { id: '3', name: 'History Finals Cram', participants: 15, subject: 'History' },
  ];

  const handleStartQuickSession = () => {
    const session = {
      id: Date.now().toString(),
      userId: user?.id || '',
      documentId: 'quick-session',
      startTime: new Date(),
      pomodoroCount: 0,
      isCompleted: false,
    };
    dispatch({ type: 'START_SESSION', payload: session });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        {!state.currentSession && (
          <Button onClick={handleStartQuickSession} size="lg">
            <Play className="w-4 h-4 mr-2" />
            Quick Study Session
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Study Time"
          value={`${Math.floor((state.stats.totalStudyTime || 0) / 60)}h ${(state.stats.totalStudyTime || 0) % 60}m`}
          subtitle="This week"
          icon={Clock}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Sessions Completed"
          value={state.stats.sessionsCompleted}
          subtitle="This month"
          icon={Target}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Average Quiz Score"
          value={`${state.stats.averageQuizScore}%`}
          subtitle="Last 10 quizzes"
          icon={Trophy}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Current Rank"
          value={`#${state.stats.rank}`}
          subtitle="In your school"
          icon={TrendingUp}
          color="orange"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer */}
        <div>
          <PomodoroTimer />
        </div>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{doc.title}</h4>
                  <p className="text-xs text-gray-600">{doc.lastRead}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full" 
                        style={{ width: `${doc.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{doc.progress}% complete</span>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/study">
              <Button variant="outline" className="w-full">
                View All Documents
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Active Study Rooms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Active Study Rooms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRooms.map((room) => (
              <div key={room.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900">{room.name}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {room.participants} active
                  </span>
                </div>
                <p className="text-xs text-gray-600">{room.subject}</p>
              </div>
            ))}
            <Link to="/rooms">
              <Button variant="outline" className="w-full">
                Browse All Rooms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}