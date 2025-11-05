/**
 * Utility to parse JSON string fields from SQLite into JavaScript objects/arrays
 * SQLite stores JSON as text, so we need to parse it when retrieving data
 */

export function parseJsonField<T = any>(value: any, defaultValue: T = [] as T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn('Failed to parse JSON field:', value);
      return defaultValue;
    }
  }
  return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * Parse all JSON fields in an object
 */
export function parseJsonFields<T extends Record<string, any>>(
  obj: T,
  jsonFields: (keyof T)[]
): T {
  const parsed = { ...obj };
  jsonFields.forEach((field) => {
    if (field in parsed) {
      parsed[field] = parseJsonField(parsed[field]);
    }
  });
  return parsed;
}

/**
 * Parse JSON fields for common data types
 */
export const parseAsset = (asset: any) => parseJsonFields(asset, [
  'tags',
  'compatibility',
  'features',
  'requirements',
  'reviews'
]);

export const parseTutorial = (tutorial: any) => parseJsonFields(tutorial, ['tags']);

export const parsePost = (post: any) => parseJsonFields(post, [
  'tags',
  'likes',
  'comments',
  'attachments'
]);

export const parseShowcaseGame = (game: any) => parseJsonFields(game, ['tags']);

export const parseProgress = (progress: any) => parseJsonFields(progress, [
  'badges',
  'tutorialProgress'
]);
