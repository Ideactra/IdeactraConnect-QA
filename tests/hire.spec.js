import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { HirePage } from '../pages/hirePage.js';

test('user can post a job from the hire flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const hirePage = new HirePage(page);

  await loginPage.open();
  await loginPage.login(process.env.EMAIL, process.env.PASSWORD);
  await loginPage.verifyHomePageVisible();

  await hirePage.openHireFlow();
  await hirePage.selectJobTitle('Software Engineer');
  await hirePage.clickContinue();
  await hirePage.fillExperienceSection();
  await hirePage.publishJob();
  await hirePage.verifyPublishedSuccess();
});