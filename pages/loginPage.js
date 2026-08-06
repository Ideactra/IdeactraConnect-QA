import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[placeholder="you@example.com"], input[type="email"]');
    this.passwordInput = page.locator('input[placeholder="••••••••"], input[type="password"]');
    this.submitButton = page.getByRole('button', { name: /continue/i });
  }

  async open() {
    await this.page.goto('');
  }

  async login(email, password) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 45000 });
  }

  async verifyHomePageVisible() {
    const createPostLocator = this.page.locator('button:has-text("Create Post")');
    await expect(createPostLocator).toBeVisible({ timeout: 45000 });
  }
}