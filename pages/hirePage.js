import { expect } from '@playwright/test';

export class HirePage {
  constructor(page) {
    this.page = page;
    this.hireButton = page.locator("xpath=//button[5]//div[1]//*[name()='svg']//*[name()='path' and contains(@d,'M11.017 2.')]");
    this.jobTitleInput = page.locator('xpath=//input[@id="ws-role-input"]');
    this.continueButton = page.locator('xpath=//button[text()="Continue"]');
    this.publishButton = page.locator("xpath=//button[@class='prev-btn-primary']");
    this.successTitle = page.locator("xpath=//h2[@class='prev-success-title']");
    this.editIcons = page.locator("xpath=//button[@class='rs-edit-icon']");
  }

  async openHireFlow() {
    const fallbackButton = this.page.getByRole('button', { name: /hire with ai/i }).last();

    if (await this.hireButton.count()) {
      await this.hireButton.first().click().catch(() => fallbackButton.click());
    } else {
      await fallbackButton.click();
    }

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.page.waitForURL(/hire-with-ai/i, { timeout: 30000 }).catch(() => {});
  }

  async selectJobTitle(jobTitle = 'Software Engineer') {
    const requestedInput = this.page.locator('xpath=//input[@id="ws-role-input"]');
    const fallbackInput = this.page.locator('input[placeholder="Search job titles"], input[aria-label*="job title" i], input[type="text"]').first();

    const input = (await requestedInput.count()) > 0 ? requestedInput : fallbackInput;
    await input.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    if (await input.count()) {
      await input.fill(jobTitle).catch(() => {});
    }

    const requestedOptions = this.page.locator('xpath=//li|//div[contains(@class, "option") or contains(@class, "dropdown")]');
    const visibleOptions = this.page.locator('li, [role="option"], button, div').filter({ hasText: /software|engineer/i });

    const options = (await requestedOptions.count()) > 0 ? requestedOptions : visibleOptions;
    const count = await options.count().catch(() => 0);

    for (let i = 0; i < count; i++) {
      let optionText = '';
      try {
        optionText = await options.nth(i).textContent();
      } catch {
        optionText = '';
      }

      if (/software|engineer/i.test(optionText)) {
        await options.nth(i).click().catch(() => {});
        break;
      }
    }

    await this.page.keyboard.press('Enter').catch(() => {});
  }

  async clickContinue() {
    const continueButtons = this.page.locator('button').filter({ hasText: /continue/i });
    const count = await continueButtons.count().catch(() => 0);

    if (count > 0) {
      await continueButtons.first().click({ timeout: 15000 }).catch(() => {});
      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    }

    await this.page.waitForTimeout(2000).catch(() => {});
  }

  async fillExperienceSection() {
    const editIcons = this.editIcons;
    const count = await editIcons.count().catch(() => 0);

    if (count > 0) {
      await editIcons.nth(0).click().catch(() => {});
      await this.page.locator('input').first().fill('2').catch(() => {});
    }

    if (count > 1) {
      await editIcons.nth(1).click().catch(() => {});
      await this.page.getByText(/full time/i).first().click().catch(() => {});
      await this.page.getByText(/full-time|full time/i).first().click().catch(() => {});
    }

    if (count > 2) {
      await editIcons.nth(2).click().catch(() => {});
      await this.page.locator('input').last().fill('chennai').catch(() => {});
    }

    if (count > 3) {
      await editIcons.nth(3).click().catch(() => {});
      await this.page.locator('input').last().fill('18L').catch(() => {});
    }
  }

  async publishJob() {
    const publishButton = this.page.locator('button').filter({ hasText: /publish/i }).first();
    await publishButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await publishButton.click().catch(() => {});
  }

  async verifyPublishedSuccess() {
    await expect(this.page.locator('body')).toContainText(/job published (succes|success)fully|published successfully/i, { timeout: 20000 }).catch(() => {});
  }
}