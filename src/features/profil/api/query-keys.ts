export const PROFILE_QUERY_KEYS = {
  all: ["user-profile"] as const,
  current: () => ["user-profile", "current"] as const,
};
