import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authRepository } from "../services/auth-repository";

/**
 * Hook to retrieve mutations for logging in and logging out.
 */
export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authRepository.login(email, password),
    onSuccess: () => {
      // Invalidate all query keys related to authentication
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      // Clear all queries related to auth and reset cache state
      queryClient.setQueryData(["auth", "session"], null);
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.setQueryData(["auth", "profile"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}

/**
 * Hook to retrieve the current active Supabase session.
 */
export function useSession() {
  return useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authRepository.getCurrentSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to retrieve the current authenticated User object.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => authRepository.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to retrieve the profile details of the current logged-in user.
 */
export function useCurrentProfile() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["auth", "profile", user?.id],
    queryFn: () => authRepository.getCurrentProfile(),
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to retrieve if the logged-in user possesses administrative credentials (DB-driven).
 */
export function useIsAdmin() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["auth", "is-admin", user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve(false);
      return authRepository.isAdmin(user.id);
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to retrieve the permissions level and role assignment details of the current user.
 */
export function usePermissions() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["auth", "permissions", user?.id],
    queryFn: () => {
      if (!user) return Promise.resolve("anonymous");
      return authRepository.getPermissions(user.id);
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
}
