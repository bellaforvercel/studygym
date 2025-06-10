import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useConvexAuth() {
  // Mock Clerk ID for development - replace with actual Clerk integration
  const mockClerkId = "user_mock_123";
  
  const user = useQuery(api.users.getUserByClerkId, { clerkId: mockClerkId });
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const updateLastActive = useMutation(api.users.updateLastActive);

  const initializeUser = async (userData: {
    email: string;
    name: string;
    avatar?: string;
  }) => {
    return await createOrUpdateUser({
      clerkId: mockClerkId,
      ...userData,
    });
  };

  const updateActivity = async (userId: Id<"users">) => {
    return await updateLastActive({ userId });
  };

  return {
    user,
    isLoading: user === undefined,
    initializeUser,
    updateActivity,
  };
}