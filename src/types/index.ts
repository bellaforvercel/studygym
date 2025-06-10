export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  studyStreak: number;
  totalStudyTime: number;
  level: number;
  createdAt: Date;
}

export interface StudySession {
  id: string;
  userId: string;
  documentId: string;
  startTime: Date;
  endTime?: Date;
  pomodoroCount: number;
  quizScore?: number;
  notes?: string;
  isCompleted: boolean;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  participants: User[];
  currentDocument?: Document;
  isActive: boolean;
  createdAt: Date;
  maxParticipants: number;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  lastReadAt?: Date;
  readingProgress: number;
  tags: string[];
  subject?: string;
}

export interface Quiz {
  id: string;
  sessionId: string;
  questions: QuizQuestion[];
  score?: number;
  completedAt?: Date;
  timeSpent: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  explanation: string;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export interface StudyStats {
  totalStudyTime: number;
  sessionsCompleted: number;
  averageQuizScore: number;
  currentStreak: number;
  documentsRead: number;
  rank: number;
}