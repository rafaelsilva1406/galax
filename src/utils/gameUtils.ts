import { Position, Size } from '../types/game';

interface BoundedObject {
  position: Position;
  size: Size;
}

interface Bounds {
  width: number;
  height: number;
}

export class GameUtils {
  /**
   * Check collision between two objects using AABB (Axis-Aligned Bounding Box) collision detection
   */
  static checkCollision(obj1: BoundedObject, obj2: BoundedObject): boolean {
    return obj1.position.x < obj2.position.x + obj2.size.width &&
           obj1.position.x + obj1.size.width > obj2.position.x &&
           obj1.position.y < obj2.position.y + obj2.size.height &&
           obj1.position.y + obj1.size.height > obj2.position.y;
  }

  /**
   * Calculate Euclidean distance between two points
   */
  static calculateDistance(point1: Position, point2: Position): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if an object is completely within the specified bounds
   */
  static isWithinBounds(object: BoundedObject, bounds: Bounds): boolean {
    return object.position.x >= 0 &&
           object.position.y >= 0 &&
           object.position.x + object.size.width <= bounds.width &&
           object.position.y + object.size.height <= bounds.height;
  }

  /**
   * Generate a random number between min and max (inclusive)
   */
  static randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Select a random element from an array
   */
  static randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Format a number as a score with comma separators
   */
  static formatScore(score: number): string {
    return score.toLocaleString();
  }

  /**
   * Format time in seconds as MM:SS
   */
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation between two values
   */
  static lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Normalize a vector
   */
  static normalizeVector(vector: { x: number; y: number }): { x: number; y: number } {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (magnitude === 0) return { x: 0, y: 0 };
    return {
      x: vector.x / magnitude,
      y: vector.y / magnitude
    };
  }

  /**
   * Calculate the angle between two points in radians
   */
  static angleBetweenPoints(point1: Position, point2: Position): number {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
  }

  /**
   * Check if a number is approximately equal to another (useful for floating-point comparisons)
   */
  static approximately(a: number, b: number, epsilon: number = 0.001): boolean {
    return Math.abs(a - b) < epsilon;
  }

  /**
   * Generate a unique ID for game objects
   */
  static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}