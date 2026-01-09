/**
 * Chromatic Visual Regression Test for my-website
 * 
 * Tests homepage across different viewports using Chromatic.
 */

import { test, takeSnapshot } from '@chromatic-com/playwright';

test.describe('my-website Visual Regression', () => {
  test('homepage - desktop', async ({ page }, testInfo) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to homepage
    console.log(`📱 Navigating to: ${page.context()._options.baseURL || 'homepage'}`);
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    console.log('📸 Taking Chromatic snapshot...');
    
    // Take Chromatic snapshot
    await takeSnapshot(page, 'homepage-desktop', testInfo);
    
    console.log('✅ Chromatic snapshot captured successfully!');
  });
  
  test('homepage - mobile', async ({ page }, testInfo) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to homepage
    console.log(`📱 Navigating to: ${page.context()._options.baseURL || 'homepage'}`);
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    console.log('📸 Taking Chromatic snapshot...');
    
    // Take Chromatic snapshot
    await takeSnapshot(page, 'homepage-mobile', testInfo);
    
    console.log('✅ Chromatic snapshot captured successfully!');
  });
});

