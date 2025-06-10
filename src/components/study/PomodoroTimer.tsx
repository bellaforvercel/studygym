import React, { useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PomodoroTimer() {
  const { state, dispatch, formatTime } = useStudy();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isTimerRunning && state.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK', payload: state.timeRemaining - 1 });
      }, 1000);
    } else if (state.timeRemaining === 0 && state.isTimerRunning) {
      dispatch({ type: 'COMPLETE_POMODORO' });
    }

    return () => clearInterval(interval);
  }, [state.isTimerRunning, state.timeRemaining, dispatch]);

  const totalTime = state.currentPhase === 'work' 
    ? state.settings.workDuration * 60
    : state.currentPhase === 'longBreak'
    ? state.settings.longBreakDuration * 60
    : state.settings.shortBreakDuration * 60;

  const progress = ((totalTime - state.timeRemaining) / totalTime) * 100;

  const handleStart = () => {
    dispatch({ type: 'START_TIMER' });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const handleReset = () => {
    dispatch({ type: 'PAUSE_TIMER' });
    const resetTime = state.currentPhase === 'work' 
      ? state.settings.workDuration * 60
      : state.currentPhase === 'longBreak'
      ? state.settings.longBreakDuration * 60
      : state.settings.shortBreakDuration * 60;
    dispatch({ type: 'TICK', payload: resetTime });
  };

  const phaseConfig = {
    work: {
      title: 'Focus Time',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-600',
    },
    shortBreak: {
      title: 'Short Break',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progressColor: 'bg-green-600',
    },
    longBreak: {
      title: 'Long Break',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-600',
    },
  };

  const currentConfig = phaseConfig[state.currentPhase];

  return (
    <Card className={cn('transition-colors', currentConfig.bgColor)}>
      <CardHeader className="text-center">
        <CardTitle className={cn('text-2xl', currentConfig.color)}>
          {currentConfig.title}
        </CardTitle>
        <div className="text-sm text-gray-600">
          Session {state.completedPomodoros + 1} • 
          {state.completedPomodoros} completed today
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={cn('text-6xl font-mono font-bold', currentConfig.color)}>
            {formatTime(state.timeRemaining)}
          </div>
        </div>

        <Progress 
          value={progress} 
          className="h-3"
        />

        <div className="flex justify-center space-x-3">
          {!state.isTimerRunning ? (
            <Button onClick={handleStart} size="lg" className="px-8">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" size="lg" className="px-8">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {state.timeRemaining === 0 && (
          <div className="text-center p-4 bg-white rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Time's up!</h3>
            <p className="text-gray-600 mb-4">
              {state.currentPhase === 'work' 
                ? 'Great job! Ready for a quiz to test your comprehension?'
                : 'Break time is over. Ready to get back to studying?'
              }
            </p>
            <div className="flex justify-center space-x-2">
              <Button 
                onClick={() => {
                  const shouldTakeLongBreak = state.completedPomodoros % state.settings.sessionsUntilLongBreak === 0;
                  if (state.currentPhase === 'work') {
                    dispatch({ 
                      type: 'START_BREAK', 
                      payload: shouldTakeLongBreak ? 'long' : 'short' 
                    });
                  } else {
                    dispatch({ type: 'TICK', payload: state.settings.workDuration * 60 });
                  }
                }}
              >
                {state.currentPhase === 'work' ? 'Take Break' : 'Continue Studying'}
              </Button>
              {state.currentPhase === 'work' && (
                <Button variant="outline">
                  Take Quiz
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}