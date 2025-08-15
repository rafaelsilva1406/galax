// Bootstrap Icons Unicode mappings
export const GAME_ICONS = {
  // Player character
  rocket: '🚀', // Fallback emoji, we'll use a better approach
  
  // Power-ups
  health: '🩹', // Bandaid
  energy: '🔋', // Battery
  ammo: '📦', // Box
  
  // Enemies
  asteroid: '💎', // Brilliance (diamond)
  planet: '☀️', // Brightness-high (sun)
  virus: '🐛', // Bug
} as const;

// Better Unicode icons that work well in canvas
export const UNICODE_ICONS = {
  rocket: '▲', // Simple triangle pointing up
  health: '+', // Plus sign for health
  energy: '⚡', // Lightning bolt for energy
  ammo: '●', // Circle for ammo
  asteroid: '◆', // Diamond for asteroid
  planet: '●', // Large circle for planet
  virus: '✦', // Star for virus
} as const;

// Icon colors
export const ICON_COLORS = {
  rocket: '#00ff00',
  health: '#ff4444',
  energy: '#4444ff', 
  ammo: '#ffff44',
  asteroid: '#888888',
  planet: '#4444ff',
  virus: '#ff4444',
} as const;

export class IconRenderer {
  static drawIcon(
    ctx: CanvasRenderingContext2D, 
    icon: keyof typeof UNICODE_ICONS,
    x: number, 
    y: number, 
    size: number,
    color?: string
  ) {
    const iconChar = UNICODE_ICONS[icon];
    const iconColor = color || ICON_COLORS[icon];
    
    ctx.save();
    
    // Set font properties
    ctx.font = `${size}px monospace`;
    ctx.fillStyle = iconColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text shadow/outline for better visibility
    ctx.strokeText(iconChar, x + size/2, y + size/2);
    ctx.fillText(iconChar, x + size/2, y + size/2);
    
    ctx.restore();
  }
  
  static drawBootstrapIcon(
    ctx: CanvasRenderingContext2D,
    icon: keyof typeof UNICODE_ICONS,
    x: number,
    y: number, 
    width: number,
    height: number,
    color?: string
  ) {
    const iconColor = color || ICON_COLORS[icon];
    
    ctx.save();
    ctx.fillStyle = iconColor;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Custom drawing for each icon type
    switch (icon) {
      case 'rocket':
        // Draw horizontal rocket shape (pointing right)
        ctx.beginPath();
        ctx.moveTo(x + width, y + height/2); // Right point (nose)
        ctx.lineTo(x + width * 0.3, y + height * 0.2); // Top left
        ctx.lineTo(x + width * 0.3, y + height * 0.4); // Top inner
        ctx.lineTo(x, y + height * 0.4); // Left top
        ctx.lineTo(x, y + height * 0.6); // Left bottom
        ctx.lineTo(x + width * 0.3, y + height * 0.6); // Bottom inner
        ctx.lineTo(x + width * 0.3, y + height * 0.8); // Bottom left
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw exhaust flame (pointing left)
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(x, y + height * 0.4);
        ctx.lineTo(x - 8, y + height/2); // Flame extends left
        ctx.lineTo(x, y + height * 0.6);
        ctx.fill();
        
        // Add small flame details
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(x + width * 0.1, y + height * 0.45);
        ctx.lineTo(x - 4, y + height/2);
        ctx.lineTo(x + width * 0.1, y + height * 0.55);
        ctx.fill();
        break;
        
      case 'health':
        // Draw cross/plus sign
        const crossThickness = width * 0.25;
        // Horizontal bar
        ctx.fillRect(x + width * 0.25, y + height * 0.4, width * 0.5, crossThickness);
        // Vertical bar  
        ctx.fillRect(x + width * 0.4, y + height * 0.25, crossThickness, width * 0.5);
        ctx.strokeRect(x + width * 0.25, y + height * 0.4, width * 0.5, crossThickness);
        ctx.strokeRect(x + width * 0.4, y + height * 0.25, crossThickness, width * 0.5);
        break;
        
      case 'energy':
        // Draw lightning bolt
        ctx.beginPath();
        ctx.moveTo(x + width * 0.4, y);
        ctx.lineTo(x + width * 0.6, y + height * 0.4);
        ctx.lineTo(x + width * 0.5, y + height * 0.4);
        ctx.lineTo(x + width * 0.6, y + height);
        ctx.lineTo(x + width * 0.4, y + height * 0.6);
        ctx.lineTo(x + width * 0.5, y + height * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'ammo':
        // Draw box
        ctx.fillRect(x + width * 0.2, y + height * 0.2, width * 0.6, height * 0.6);
        ctx.strokeRect(x + width * 0.2, y + height * 0.2, width * 0.6, height * 0.6);
        // Draw box lines
        ctx.beginPath();
        ctx.moveTo(x + width * 0.5, y + height * 0.2);
        ctx.lineTo(x + width * 0.5, y + height * 0.8);
        ctx.moveTo(x + width * 0.2, y + height * 0.5);
        ctx.lineTo(x + width * 0.8, y + height * 0.5);
        ctx.stroke();
        break;
        
      case 'asteroid':
        // Draw diamond/crystal shape
        ctx.beginPath();
        ctx.moveTo(x + width/2, y); // Top
        ctx.lineTo(x + width * 0.8, y + height * 0.4); // Top right
        ctx.lineTo(x + width * 0.7, y + height); // Bottom right
        ctx.lineTo(x + width * 0.3, y + height); // Bottom left
        ctx.lineTo(x + width * 0.2, y + height * 0.4); // Top left
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'planet':
        // Draw circle with rings
        ctx.beginPath();
        ctx.arc(x + width/2, y + height/2, Math.min(width, height) * 0.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Draw ring around planet
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width * 0.45, height * 0.15, Math.PI * 0.2, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'virus':
        // Draw spiky virus shape
        ctx.beginPath();
        const centerX = x + width/2;
        const centerY = y + height/2;
        const radius = Math.min(width, height) * 0.3;
        
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const spikLength = i % 2 === 0 ? radius * 1.5 : radius * 0.8;
          const spikX = centerX + Math.cos(angle) * spikLength;
          const spikY = centerY + Math.sin(angle) * spikLength;
          
          if (i === 0) {
            ctx.moveTo(spikX, spikY);
          } else {
            ctx.lineTo(spikX, spikY);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      default:
        // Fallback: draw a simple rectangle
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        break;
    }
    
    ctx.restore();
  }
}