import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { mockUsers } from "./mockData"
import type { User } from "@shared/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to find user by UID
export function findUserByUid(uid: string): User | undefined {
  return mockUsers.find(user => user.uid === uid);
}