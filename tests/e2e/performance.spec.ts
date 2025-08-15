import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load the main menu quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await expect(page.locator('text=🚀 GALAX 🚀')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    console.log(`Menu loaded in ${loadTime}ms`);
  });

  test('should start game within reasonable time', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game elements to be visible
    await expect(page.locator('text=Health')).toBeVisible();
    
    const gameStartTime = Date.now() - startTime;
    
    // Game should start within 10 seconds
    expect(gameStartTime).toBeLessThan(10000);
    console.log(`Game started in ${gameStartTime}ms`);
  });

  test('should maintain smooth performance during gameplay', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game to load
    await page.waitForTimeout(3000);
    
    // Monitor performance
    const performanceEntries = await page.evaluate(() => {
      return performance.getEntriesByType('measure').map(entry => ({
        name: entry.name,
        duration: entry.duration
      }));
    });
    
    // Log performance metrics
    console.log('Performance entries:', performanceEntries);
    
    // Simulate gameplay for 30 seconds
    const gameplay = async () => {
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(100);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
        await page.keyboard.press('Space');
        await page.waitForTimeout(800);
      }
    };
    
    const gameplayStart = Date.now();
    await gameplay();
    const gameplayDuration = Date.now() - gameplayStart;
    
    // Should complete gameplay simulation smoothly
    expect(gameplayDuration).toBeLessThan(35000); // 30s + 5s buffer
    
    // Game should still be responsive
    await expect(page.locator('text=Health')).toBeVisible();
  });

  test('should handle rapid input without lag', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game to load
    await page.waitForTimeout(3000);
    
    // Rapid input test
    const rapidInput = async () => {
      for (let i = 0; i < 100; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(50);
      }
    };
    
    const rapidInputStart = Date.now();
    await rapidInput();
    const rapidInputDuration = Date.now() - rapidInputStart;
    
    // Should handle 100 inputs in under 10 seconds
    expect(rapidInputDuration).toBeLessThan(10000);
    
    // Game should still be responsive after rapid input
    await expect(page.locator('text=Energy')).toBeVisible();
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Start and stop game multiple times
    for (let i = 0; i < 3; i++) {
      await page.locator('text=🎮 Start Game').click();
      await page.waitForTimeout(2000);
      
      // Simulate going back to menu (would need implementation)
      await page.reload();
      await page.waitForTimeout(1000);
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      console.log(`Memory increase: ${memoryIncrease / 1024 / 1024}MB`);
    }
  });
});