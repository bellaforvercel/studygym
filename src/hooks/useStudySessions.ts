import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useStudySessions(userId?: Id<"users">) {
  const activeSession = useQuery(
    api.studySessions.getActiveSession,
    userId ? { userId } : "skip"
  );
  
  const userSessions = useQuery(
    api.studySessions.getUserSessions,
    userId ? { userId, limit: 10 } : "skip"
  );

  const startSession = useMutation(api.studySessions.startStudySession);
  const endSession = useMutation(api.studySessions.endStudySession);
  const updatePomodoro = useMutation(api.studySessions.updatePomodoroCount);

  const startStudySession = async (params: {
    documentId?: Id<"documents">;
    studyRoomId?: Id<"studyRooms">;
    sessionType: "solo" | "group";
  }) => {
    if (!userId) throw new Error("User ID required");
    
    return await startSession({
      userId,
      ...params,
    });
  };

  const endStudySession = async (
    sessionId: Id<"studySessions">,
    params?: {
      notes?: string;
      focusRating?: number;
    }
  ) => {
    return await endSession({
      sessionId,
      ...params,
    });
  };

  const incrementPomodoro = async (sessionId: Id<"studySessions">) => {
    return await updatePomodoro({ sessionId });
  };

  return {
    activeSession,
    userSessions,
    startStudySession,
    endStudySession,
    incrementPomodoro,
    isLoading: activeSession === undefined || userSessions === undefined,
  };
}