import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useDocuments(userId?: Id<"users">) {
  const userDocuments = useQuery(
    api.documents.getUserDocuments,
    userId ? { userId } : "skip"
  );
  
  const recentDocuments = useQuery(
    api.documents.getRecentDocuments,
    userId ? { userId, limit: 5 } : "skip"
  );

  const createDocument = useMutation(api.documents.createDocument);
  const updateProgress = useMutation(api.documents.updateReadingProgress);
  const updateDocument = useMutation(api.documents.updateDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const uploadDocument = async (params: {
    title: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    storageId?: Id<"_storage">;
    tags?: string[];
    subject?: string;
    isPublic?: boolean;
    totalPages?: number;
    extractedText?: string;
  }) => {
    if (!userId) throw new Error("User ID required");
    
    return await createDocument({
      userId,
      ...params,
    });
  };

  const updateReadingProgress = async (
    documentId: Id<"documents">,
    progress: number
  ) => {
    return await updateProgress({ documentId, progress });
  };

  const searchDocuments = useQuery(
    api.documents.searchDocuments,
    userId ? { userId, searchTerm: "", limit: 20 } : "skip"
  );

  return {
    userDocuments,
    recentDocuments,
    uploadDocument,
    updateReadingProgress,
    updateDocument,
    deleteDocument,
    searchDocuments,
    isLoading: userDocuments === undefined,
  };
}