import React from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { StatsCard } from '@/components/progress/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import {
  Clock,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  BookOpen,
  Zap,
  Award
} from 'lucide-react';

export function Progress() {
  const { state } = useStudy();

  const weeklyData = [
    { day: 'Mon', sessions: 3, time: 75 },
    { day: 'Tue', sessions: 2, time: 50 },
    { day: 'Wed', sessions: 4, time: 100 },
    { day: 'Thu', sessions: 3, time: 75 },
    { day: 'Fri', sessions: 5, time: 125 },
    { day: 'Sat', sessions: 2, time: 50 },
    { day: 'Sun', sessions: 1, time: 25 },
  ];

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first study session', earned: true, date: 'Jan 15' },
    { id: 2, title: 'Week Warrior', description: 'Study for 7 days in a row', earned: true, date: 'Jan 22' },
    { id: 3, title: 'Quiz Master', description: 'Score 90%+ on 5 quizzes', earned: true, date: 'Jan 28' },
    { id: 4, title: 'Focus Champion', description: 'Complete 25 Pomodoro sessions', earned: false, progress: 18 },
    { id: 5, title: 'Knowledge Seeker', description: 'Read 100 pages', earned: false, progress: 73 },
    { id: 6, title: 'Team Player', description: 'Join 10 study rooms', earned: false, progress: 6 },
  ];

  const subjects = [
    { name: 'Biology', time: 480, sessions: 24, color: 'bg-green-500' },
    { name: 'Mathematics', time: 360, sessions: 18, color: 'bg-blue-500' },
    { name: 'History', time: 240, sessions: 12, color: 'bg-purple-500' },
    { name: 'Chemistry', time: 180, sessions: 9, color: 'bg-orange-500' },
    { name: 'Literature', time: 120, sessions: 6, color: 'bg-pink-500' },
  ];

  const totalTime = subjects.reduce((sum, subject) => sum + subject.time, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track your study journey and celebrate your achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Study Time"
          value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}m`}
          subtitle="All time"
          icon={Clock}
          color="blue"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Sessions This Week"
          value={weeklyData.reduce((sum, day) => sum + day.sessions, 0)}
          subtitle="7 days"
          icon={Target}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Current Streak"
          value={`${state.stats.currentStreak} days`}
          subtitle="Keep it going!"
          icon={Zap}
          color="orange"
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Global Rank"
          value={`#${state.stats.rank}`}
          subtitle="In your school"
          icon={TrendingUp}
          color="purple"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-8">
                      {day.day}
                    </span>
                    <div className="flex-1">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(day.time / 125) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {day.sessions} sessions
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.floor(day.time / 60)}h {day.time % 60}m
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Study Time by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {subject.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.floor(subject.time / 60)}h {subject.time % 60}m
                    </span>
                  </div>
                  <ProgressBar 
                    value={(subject.time / totalTime) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {subject.sessions} sessions completed
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.earned
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Trophy
                      className={`w-5 h-5 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`}
                    />
                    <h3 className="font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {achievement.date}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {achievement.description}
                </p>
                {!achievement.earned && achievement.progress && (
                  <div className="space-y-1">
                    <ProgressBar value={(achievement.progress / 25) * 100} className="h-1" />
                    <div className="text-xs text-gray-500">
                      {achievement.progress}/25 progress
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}