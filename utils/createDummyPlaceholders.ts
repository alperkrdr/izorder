// This utility creates simple SVG placeholder images that can be used directly without external dependencies

export const createPlaceholderImage = (width: number, height: number, text: string, bgColor: string = '#f3f4f6', textColor: string = '#6b7280'): string => {
  // Create SVG placeholder with specified dimensions and text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${Math.floor(width/15)}px" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  // Convert to base64 data URL
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
};

// Generate placeholder images for different content types
export const PlaceholderSVGs = {
  default: createPlaceholderImage(800, 600, 'Placeholder Image', '#f3f4f6', '#6b7280'),
  news: createPlaceholderImage(800, 400, 'News Image', '#e6f2ff', '#3b82f6'),
  press: createPlaceholderImage(800, 400, 'Press Coverage', '#fff7ed', '#f97316'),
  gallery: createPlaceholderImage(800, 600, 'Gallery Image', '#f0fdf4', '#22c55e'),
  history: createPlaceholderImage(800, 400, 'History Image', '#fef2f2', '#ef4444'),
  boardMember: createPlaceholderImage(300, 400, 'Board Member', '#fffbeb', '#eab308'),
  
  // Specific placeholders
  historyMain: createPlaceholderImage(800, 400, 'History Main Image', '#fef2f2', '#ef4444'),
  historyEvents: createPlaceholderImage(600, 400, 'Event Image', '#faf5ff', '#a855f7'),
  historyMembers: createPlaceholderImage(600, 400, 'Members Image', '#f0f9ff', '#0ea5e9'),
}; 