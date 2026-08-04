import { expect } from '@playwright/test';

export class HirePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.hireButton = page.locator("xpath=//button[5]//div[1]//*[name()='svg']//*[name()='path' and contains(@d,'M11.017 2.')]/ancestor::button[1]");
    this.jobTitleInput = page.locator("xpath=//input[@id='ws-role-input']");
    this.searchContinueButton = page.locator("xpath=//button[@class='ws-btn-primary']");
    this.descriptionContinueButton = page.locator("xpath=//button[@class='jdesc-btn-primary']");
    this.editIcons = page.locator("xpath=//button[@class='rs-edit-icon']");
    this.publishButton = page.locator("xpath=//button[@class='prev-btn-primary']");
    this.successTitle = page.locator("xpath=//h2[@class='prev-success-title']");
    this.dropdownOptions = page.locator("xpath=//ul//li | //div[contains(@role,'option')] | //div[contains(@class,'dropdown')]//div");
  }

  async openHireFlow() {
    await this.hireButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.hireButton.click();
    await this.page.waitForURL(/hire-with-ai|hire/i, { timeout: 30000 });
  }

  async selectRandomJobTitle() {
    const jobTitles = ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'QA Engineer', 'Product Manager'];
    const selectedTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];

    await this.jobTitleInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.jobTitleInput.click();
    await this.jobTitleInput.fill(selectedTitle);

    await this.page.waitForTimeout(500);
    await this.dropdownOptions.first().waitFor({ state: 'visible', timeout: 10000 });

    const optionCount = await this.dropdownOptions.count();
    for (let i = 0; i < optionCount; i++) {
      const option = this.dropdownOptions.nth(i);
      const text = (await option.textContent())?.trim() || '';
      if (/software engineer|software|engineer/i.test(text)) {
        await option.click();
        return selectedTitle;
      }
    }

    if (optionCount > 0) {
      await this.dropdownOptions.first().click();
    }

    return selectedTitle;
  }

  async clickSearchContinue() {
    await this.searchContinueButton.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.searchContinueButton.first().click();
  }

  async clickDescriptionContinue() {
    await this.descriptionContinueButton.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.descriptionContinueButton.first().click();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1500);
  }

  async fillExperienceSection() {
    await this.editIcons.first().waitFor({ state: 'visible', timeout: 15000 });

    await this.editIcons.nth(0).click();
    await this.page.locator("xpath=(//input)[1]").fill('2');

    await this.editIcons.nth(1).click();
    const fullTimeOption = this.page.locator("xpath=//div[contains(text(),'Full Time') or contains(text(),'full time') or contains(text(),'full-time')]");
    await fullTimeOption.first().waitFor({ state: 'visible', timeout: 10000 });
    await fullTimeOption.first().click();

    await this.editIcons.nth(2).click();
    await this.page.locator("xpath=(//input)[last()]").fill('chennai');

    await this.editIcons.nth(3).click();
    await this.page.locator("xpath=(//input)[last()]").fill('18L');
  }

  async publishJob() {
    await this.publishButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.publishButton.click();
  }

  async verifyPublishedSuccess() {
    await this.successTitle.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.successTitle).toHaveText(/job published successfully/i);
  }
}
