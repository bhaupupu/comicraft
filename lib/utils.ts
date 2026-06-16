import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditional + de-duplicated Tailwind class merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
