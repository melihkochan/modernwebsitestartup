import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminRepository } from "../services/admin-repository";

// 1. Suggestions Management Hooks
export function useAdminSuggestions() {
  return useQuery({
    queryKey: ["admin", "suggestions"],
    queryFn: () => adminRepository.getSuggestions(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useApproveSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) =>
      adminRepository.updateSuggestionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
}

export function useDeleteSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
}

// 2. Stream History Management Hooks
export function useStreamHistory() {
  return useQuery({
    queryKey: ["admin", "stream-history"],
    queryFn: () => adminRepository.getStreamHistory(),
  });
}

export function useUpdateStreamHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: any }) =>
      adminRepository.updateStreamHistory(id, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stream-history"] });
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

export function useDeleteStreamHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteStreamHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stream-history"] });
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

// 3. Creator Sync Control Hooks
export function useCreatorSyncStatus() {
  return useQuery({
    queryKey: ["admin", "creator-sync-status"],
    queryFn: () => adminRepository.getSyncStatus(),
    refetchInterval: 10000,
  });
}

export function useTriggerCreatorSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminRepository.triggerSync(),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "creator-sync-status"], data);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["live"] });
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

export function useCreatorStats() {
  return useQuery({
    queryKey: ["admin", "creator-stats"],
    queryFn: () => adminRepository.getCreatorStats(),
    refetchInterval: 15000,
  });
}

// 4. Setup Items CRUD Hooks
export function useAdminSetupItems() {
  return useQuery({
    queryKey: ["admin", "setup-items"],
    queryFn: () => adminRepository.getSetupItems(),
  });
}

export function useCreateSetupItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: any) => adminRepository.createSetupItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "setup-items"] });
      queryClient.invalidateQueries({ queryKey: ["setup"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

export function useUpdateSetupItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, item }: { id: string; item: any }) =>
      adminRepository.updateSetupItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "setup-items"] });
      queryClient.invalidateQueries({ queryKey: ["setup"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

export function useDeleteSetupItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteSetupItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "setup-items"] });
      queryClient.invalidateQueries({ queryKey: ["setup"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

// 5. FAQ CRUD Hooks
export function useAdminFaqs() {
  return useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: () => adminRepository.getFaqs(),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (faq: any) => adminRepository.createFaq(faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, faq }: { id: string; faq: any }) =>
      adminRepository.updateFaq(id, faq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRepository.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

// 6. Site Settings CRUD Hooks
export function useSiteSettings() {
  return useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: () => adminRepository.getSiteSettings(),
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      adminRepository.updateSiteSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity-logs"] });
    },
  });
}

// 7. Activity Logs Hook
export function useActivityLogs() {
  return useQuery({
    queryKey: ["admin", "activity-logs"],
    queryFn: () => adminRepository.getActivityLogs(),
    refetchInterval: 30000, // Poll every 30 seconds
  });
}
