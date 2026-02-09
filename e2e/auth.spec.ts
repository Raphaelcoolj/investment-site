import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow a user to login and see the dashboard', async ({ page }) => {
        // This assumes the dev server is running on localhost:3000
        await page.goto('http://localhost:3000/auth/login');

        // Fill login form
        await page.fill('input[name="usernameOrEmail"]', 'testuser');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Verify navigation to dashboard
        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.locator('h1')).toContainText('Dashboard');
        
        // Verify balance is visible
        await expect(page.locator('text=Total Balance')).toBeVisible();
    });

    test('should show error on invalid login', async ({ page }) => {
        await page.goto('/auth/login');

        await page.fill('input[name="usernameOrEmail"]', 'wronguser');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });
});

test.describe('Deposit Flow', () => {
    test('should allow user to initiate a deposit', async ({ page }) => {
        // Log in first (simplified or use saved state)
        await page.goto('/auth/login');
        await page.fill('input[name="usernameOrEmail"]', 'testuser');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*dashboard/);

        // Click on a coin to open deposit modal
        await page.click('text=Bitcoin');
        
        // Fill deposit amount
        await page.fill('input[placeholder="Enter Amount"]', '500');
        await page.click('text=I Have Made Payment');

        // Verify success message and redirect or update
        await expect(page.locator('text=Deposit recorded')).toBeVisible();
        
        // Check transactions page
        await page.goto('/dashboard/transactions');
        await expect(page.locator('text=Pending')).toBeVisible();
        await expect(page.locator('text=500')).toBeVisible();
    });
});
