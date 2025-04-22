import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  /**
   * Combines multiple class names into a single string.
   *
   * This function uses `clsx` and `tailwind-merge` to efficiently merge CSS class names.
   * It handles conditional class names and ensures that Tailwind CSS utility classes are merged correctly.
   *
   * @param inputs - An array of class names or conditional class objects.
   * @returns A single string containing all merged class names.
   */
  return clsx(inputs);
}

/**
 * Formats a number as a currency string in US Dollar format.
 *
 * @param amount - The number to format as currency.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

