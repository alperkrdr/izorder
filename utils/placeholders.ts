// Placeholder images for use throughout the application when real images aren't available
import { PlaceholderSVGs } from './createDummyPlaceholders';

// Export both path-based placeholders (from public folder) and directly usable SVG placeholders
export const PlaceholderImages = {
  // Generic placeholders - fallback to SVGs if public files don't exist
  default: PlaceholderSVGs.default,
  news: PlaceholderSVGs.news,
  press: PlaceholderSVGs.press,
  gallery: PlaceholderSVGs.gallery,
  history: PlaceholderSVGs.history,
  boardMember: PlaceholderSVGs.boardMember,
  
  // Specific placeholders
  historyMain: PlaceholderSVGs.historyMain,
  historyEvents: PlaceholderSVGs.historyEvents,
  historyMembers: PlaceholderSVGs.historyMembers,
}; 