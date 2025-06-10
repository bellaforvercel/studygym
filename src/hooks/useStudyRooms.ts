import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useStudyRooms(userId?: Id<"users">) {
  const publicRooms = useQuery(api.studyRooms.getPublicStudyRooms, { limit: 20 });
  const userRooms = useQuery(
    api.studyRooms.getUserStudyRooms,
    userId ? { userId } : "skip"
  );

  const createRoom = useMutation(api.studyRooms.createStudyRoom);
  const joinRoom = useMutation(api.studyRooms.joinStudyRoom);
  const leaveRoom = useMutation(api.studyRooms.leaveStudyRoom);
  const updateStatus = useMutation(api.studyRooms.updateParticipantStatus);

  const createStudyRoom = async (params: {
    name: string;
    description: string;
    isPublic: boolean;
    maxParticipants: number;
    subject?: string;
    currentDocument?: Id<"documents">;
    settings: {
      allowChat: boolean;
      pomodoroSync: boolean;
      requireApproval: boolean;
    };
  }) => {
    if (!userId) throw new Error("User ID required");
    
    return await createRoom({
      createdBy: userId,
      ...params,
    });
  };

  const joinStudyRoom = async (roomId: Id<"studyRooms">) => {
    if (!userId) throw new Error("User ID required");
    
    return await joinRoom({ roomId, userId });
  };

  const leaveStudyRoom = async (roomId: Id<"studyRooms">) => {
    if (!userId) throw new Error("User ID required");
    
    return await leaveRoom({ roomId, userId });
  };

  const updateParticipantStatus = async (
    roomId: Id<"studyRooms">,
    status: "active" | "idle" | "away"
  ) => {
    if (!userId) throw new Error("User ID required");
    
    return await updateStatus({ roomId, userId, status });
  };

  return {
    publicRooms,
    userRooms,
    createStudyRoom,
    joinStudyRoom,
    leaveStudyRoom,
    updateParticipantStatus,
    isLoading: publicRooms === undefined,
  };
}