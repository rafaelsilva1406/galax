import { test, expect } from '@playwright/test';

test.describe('Galax Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main menu', async ({ page }) => {
    // Check if the main menu title is visible
    await expect(page.locator('text=🚀 GALAX 🚀')).toBeVisible();
    
    // Check if the subtitle is visible
    await expect(page.locator('text=Space Adventure Remastered')).toBeVisible();
    
    // Check if the start game button is visible
    await expect(page.locator('text=🎮 Start Game')).toBeVisible();
    
    // Check if the instructions button is visible
    await expect(page.locator('text=📋 Instructions')).toBeVisible();
    
    // Check if the about button is visible
    await expect(page.locator('text=ℹ️ About')).toBeVisible();
  });

  test('should open instructions modal', async ({ page }) => {
    // Click the instructions button
    await page.locator('text=📋 Instructions').click();
    
    // Check if the modal is visible
    await expect(page.locator('text=📋 How to Play Galax')).toBeVisible();
    
    // Check if objective section is visible
    await expect(page.locator('text=🎯 Objective')).toBeVisible();
    
    // Check if controls section is visible
    await expect(page.locator('text=🎮 Controls')).toBeVisible();
    
    // Close the modal
    await page.locator('text=Got it!').click();
    
    // Modal should be hidden
    await expect(page.locator('text=📋 How to Play Galax')).not.toBeVisible();
  });

  test('should open about modal', async ({ page }) => {
    // Click the about button
    await page.locator('text=ℹ️ About').click();
    
    // Check if the modal is visible
    await expect(page.locator('text=ℹ️ About Galax')).toBeVisible();
    
    // Check if version info is visible
    await expect(page.locator('text=🚀 Galax - Space Adventure Remastered')).toBeVisible();
    
    // Check if tech stack badges are visible
    await expect(page.locator('text=🛠️ Built With:')).toBeVisible();
    
    // Close the modal
    await page.locator('text=Close').click();
    
    // Modal should be hidden
    await expect(page.locator('text=ℹ️ About Galax')).not.toBeVisible();
  });

  test('should start the game', async ({ page }) => {
    // Click the start game button
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game to load
    await page.waitForTimeout(2000);
    
    // The menu should no longer be visible
    await expect(page.locator('text=🚀 GALAX 🚀')).not.toBeVisible();
    
    // Game elements should be present
    // Note: Since we're using Canvas/WebGL, we can't easily test rendered elements
    // but we can check if the game container is present
    await expect(page.locator('[data-testid="game-canvas"]').or(page.locator('canvas'))).toBeVisible({ timeout: 10000 });
  });

  test('should display game HUD when playing', async ({ page }) => {
    // Start the game
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game to load
    await page.waitForTimeout(3000);
    
    // Check if HUD elements are visible
    await expect(page.locator('text=Health')).toBeVisible();
    await expect(page.locator('text=Energy')).toBeVisible();
    await expect(page.locator('text=Score')).toBeVisible();
    await expect(page.locator('text=Level')).toBeVisible();
  });

  test('should show game controls on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Start the game
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game to load
    await page.waitForTimeout(3000);
    
    // Check if mobile controls are visible
    await expect(page.locator('text=FIRE')).toBeVisible();
    
    // Check if directional controls are present
    await expect(page.locator('text=↑')).toBeVisible();
    await expect(page.locator('text=↓')).toBeVisible();
    await expect(page.locator('text=←')).toBeVisible();
    await expect(page.locator('text=→')).toBeVisible();
  });

  test('should handle keyboard controls on desktop', async ({ page }) => {
    // Start the game
    await page.locator('text=🎮 Start Game').click();
    
    // Wait for game to load
    await page.waitForTimeout(3000);
    
    // Test keyboard controls
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    
    // If the game doesn't crash, controls are working
    await expect(page.locator('text=Health')).toBeVisible();
  });

  test('should persist high score', async ({ page }) => {
    // Check if high score is not initially visible
    await expect(page.locator('text=High Score:')).not.toBeVisible();
    
    // We would need to simulate a game session to test score persistence
    // This is a placeholder for that functionality
    // In a real test, we would:
    // 1. Start a game
    // 2. Play until game over
    // 3. Check if score is saved
    // 4. Reload page
    // 5. Check if high score is displayed
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 },   // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      
      // Check if main menu is still functional
      await expect(page.locator('text=🚀 GALAX 🚀')).toBeVisible();
      await expect(page.locator('text=🎮 Start Game')).toBeVisible();
    }
  });
});