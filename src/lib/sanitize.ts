/**
 * Sanitizes user input for JSON transmission
 * - Strips newline characters (\n, \r)
 * - Trims whitespace from start and end
 * - Ensures the question is properly escaped for JSON
 */
export const sanitizeQuestionInput = (input: string): string => {
  return input
    .replace(/[\r\n]+/g, ' ')  // Replace newlines with spaces
    .replace(/\s+/g, ' ')       // Normalize multiple spaces to single
    .trim();                    // Trim whitespace
};
