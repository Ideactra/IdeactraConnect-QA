import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';

test('user can log in and view the home page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('rajasuma.dk@intellectidea.com', 'heysky12A1@12');

  //await expect(page.locator('//span[text()="View Profile"]')).toBeVisible();
  await loginPage.verifyHomePageVisible();
});
