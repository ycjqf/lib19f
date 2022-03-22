export const accountCapacities = ["user", "reviewer", "admin"] as const;
export type AccountCapacity = typeof accountCapacities[number];
