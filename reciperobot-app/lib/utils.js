/*
  Miscellaneous helper methods and utilities for use in Recipe Robot
*/

/**
 * Capitalise the first letter of a string.
 * Expects a non-empty string as argument. */
export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// from https://ui.shadcn.com/docs/installation/next
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}