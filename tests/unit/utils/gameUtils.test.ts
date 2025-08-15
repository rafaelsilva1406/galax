// First, let's create the utility functions to test
import { GameUtils } from '../../../src/utils/gameUtils';

describe('GameUtils', () => {
  describe('collision detection', () => {
    it('should detect collision between overlapping objects', () => {
      const obj1 = {
        position: { x: 10, y: 10 },
        size: { width: 20, height: 20 }
      };
      
      const obj2 = {
        position: { x: 15, y: 15 },
        size: { width: 20, height: 20 }
      };

      expect(GameUtils.checkCollision(obj1, obj2)).toBe(true);
    });

    it('should not detect collision between non-overlapping objects', () => {
      const obj1 = {
        position: { x: 10, y: 10 },
        size: { width: 20, height: 20 }
      };
      
      const obj2 = {
        position: { x: 50, y: 50 },
        size: { width: 20, height: 20 }
      };

      expect(GameUtils.checkCollision(obj1, obj2)).toBe(false);
    });

    it('should detect edge collision correctly', () => {
      const obj1 = {
        position: { x: 10, y: 10 },
        size: { width: 20, height: 20 }
      };
      
      const obj2 = {
        position: { x: 30, y: 30 },
        size: { width: 20, height: 20 }
      };

      expect(GameUtils.checkCollision(obj1, obj2)).toBe(false);
    });
  });

  describe('distance calculation', () => {
    it('should calculate distance between two points correctly', () => {
      const point1 = { x: 0, y: 0 };
      const point2 = { x: 3, y: 4 };

      const distance = GameUtils.calculateDistance(point1, point2);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should return zero for identical points', () => {
      const point = { x: 10, y: 20 };

      const distance = GameUtils.calculateDistance(point, point);
      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const point1 = { x: -3, y: -4 };
      const point2 = { x: 0, y: 0 };

      const distance = GameUtils.calculateDistance(point1, point2);
      expect(distance).toBe(5);
    });
  });

  describe('bounds checking', () => {
    it('should detect object within bounds', () => {
      const object = {
        position: { x: 50, y: 50 },
        size: { width: 20, height: 20 }
      };

      const bounds = { width: 800, height: 600 };

      expect(GameUtils.isWithinBounds(object, bounds)).toBe(true);
    });

    it('should detect object outside bounds', () => {
      const object = {
        position: { x: 850, y: 50 },
        size: { width: 20, height: 20 }
      };

      const bounds = { width: 800, height: 600 };

      expect(GameUtils.isWithinBounds(object, bounds)).toBe(false);
    });

    it('should handle object partially outside bounds', () => {
      const object = {
        position: { x: 790, y: 50 },
        size: { width: 20, height: 20 }
      };

      const bounds = { width: 800, height: 600 };

      expect(GameUtils.isWithinBounds(object, bounds)).toBe(false);
    });

    it('should handle negative positions', () => {
      const object = {
        position: { x: -10, y: 50 },
        size: { width: 20, height: 20 }
      };

      const bounds = { width: 800, height: 600 };

      expect(GameUtils.isWithinBounds(object, bounds)).toBe(false);
    });
  });

  describe('random utilities', () => {
    it('should generate random number within range', () => {
      const min = 10;
      const max = 20;

      for (let i = 0; i < 100; i++) {
        const random = GameUtils.randomBetween(min, max);
        expect(random).toBeGreaterThanOrEqual(min);
        expect(random).toBeLessThanOrEqual(max);
      }
    });

    it('should handle equal min and max values', () => {
      const value = 15;
      const random = GameUtils.randomBetween(value, value);
      expect(random).toBe(value);
    });

    it('should select random element from array', () => {
      const array = ['apple', 'banana', 'cherry', 'date'];
      
      for (let i = 0; i < 50; i++) {
        const selected = GameUtils.randomFromArray(array);
        expect(array).toContain(selected);
      }
    });

    it('should handle single element array', () => {
      const array = ['only'];
      const selected = GameUtils.randomFromArray(array);
      expect(selected).toBe('only');
    });
  });

  describe('formatting utilities', () => {
    it('should format large numbers with commas', () => {
      expect(GameUtils.formatScore(1234)).toBe('1,234');
      expect(GameUtils.formatScore(1234567)).toBe('1,234,567');
      expect(GameUtils.formatScore(123)).toBe('123');
    });

    it('should handle zero and negative numbers', () => {
      expect(GameUtils.formatScore(0)).toBe('0');
      expect(GameUtils.formatScore(-1234)).toBe('-1,234');
    });

    it('should format time as minutes:seconds', () => {
      expect(GameUtils.formatTime(65)).toBe('1:05');
      expect(GameUtils.formatTime(30)).toBe('0:30');
      expect(GameUtils.formatTime(0)).toBe('0:00');
      expect(GameUtils.formatTime(3661)).toBe('61:01');
    });
  });

  describe('clamp utility', () => {
    it('should clamp values within range', () => {
      expect(GameUtils.clamp(15, 10, 20)).toBe(15);
      expect(GameUtils.clamp(5, 10, 20)).toBe(10);
      expect(GameUtils.clamp(25, 10, 20)).toBe(20);
    });

    it('should handle edge cases', () => {
      expect(GameUtils.clamp(10, 10, 20)).toBe(10);
      expect(GameUtils.clamp(20, 10, 20)).toBe(20);
    });
  });

  describe('lerp utility', () => {
    it('should interpolate between values correctly', () => {
      expect(GameUtils.lerp(0, 100, 0.5)).toBe(50);
      expect(GameUtils.lerp(10, 20, 0)).toBe(10);
      expect(GameUtils.lerp(10, 20, 1)).toBe(20);
      expect(GameUtils.lerp(0, 100, 0.25)).toBe(25);
    });
  });
});