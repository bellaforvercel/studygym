import React, { createContext, useContext, useState, useReducer } from 'react';
import { StudySession, PomodoroSettings, StudyStats } from '@/types';

interface StudyState {
  currentSession: StudySession | null;
  isTimerRunning: boolean;
  timeRemaining: number;
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  completedPomodoros: number;
  settings: PomodoroSettings;
  stats: StudyStats;
}

type StudyAction =
  | { type: 'START_SESSION'; payload: StudySession }
  | { type: 'END_SESSION' }
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'TICK'; payload: number }
  | { type: 'COMPLETE_POMODORO' }
  | { type: 'START_BREAK'; payload: 'short' | 'long' }
  | { type: 'UPDATE_SETTINGS'; payload: PomodoroSettings };

const initialState: StudyState = {
  currentSession: null,
  isTimerRunning: false,
  timeRemaining: 25 * 60, // 25 minutes in seconds
  currentPhase: 'work',
  completedPomodoros: 0,
  settings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  },
  stats: {
    totalStudyTime: 1280,
    sessionsCompleted: 42,
    averageQuizScore: 87.5,
    currentStreak: 7,
    documentsRead: 12,
    rank: 15,
  },
};

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        currentSession: action.payload,
        timeRemaining: state.settings.workDuration * 60,
        currentPhase: 'work',
        completedPomodoros: 0,
      };
    case 'END_SESSION':
      return {
        ...state,
        currentSession: null,
        isTimerRunning: false,
        completedPomodoros: 0,
      };
    case 'START_TIMER':
      return { ...state, isTimerRunning: true };
    case 'PAUSE_TIMER':
      return { ...state, isTimerRunning: false };
    case 'TICK':
      return { ...state, timeRemaining: Math.max(0, action.payload) };
    case 'COMPLETE_POMODORO':
      return {
        ...state,
        completedPomodoros: state.completedPomodoros + 1,
        isTimerRunning: false,
      };
    case 'START_BREAK':
      const breakDuration = action.payload === 'long' 
        ? state.settings.longBreakDuration 
        : state.settings.shortBreakDuration;
      return {
        ...state,
        currentPhase: action.payload === 'long' ? 'longBreak' : 'shortBreak',
        timeRemaining: breakDuration * 60,
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

interface StudyContextType {
  state: StudyState;
  dispatch: React.Dispatch<StudyAction>;
  formatTime: (seconds: number) => string;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <StudyContext.Provider value={{ state, dispatch, formatTime }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}