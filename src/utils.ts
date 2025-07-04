/**
 * Utility functions for Hazuki project
 */

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns A new shuffled array (original array is not modified)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array] // Create a copy to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] // Swap elements
  }
  return shuffled
}
