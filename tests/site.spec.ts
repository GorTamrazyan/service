import { test, expect } from '@playwright/test';

// ─── Главная страница ───────────────────────────────────────────────────────
test('главная страница: заголовок ONIK', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ONIK/i);
});

test('главная страница: хедер виден', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header');
  await expect(header).toBeVisible();
});

test('главная страница: футер виден', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();
});

// ─── Навигация ──────────────────────────────────────────────────────────────
test('страница Terms открывается', async ({ page }) => {
  await page.goto('/terms');
  // Берём последний h1, т.к. в хедере тоже есть h1
  await expect(page.locator('h1').last()).toContainText('Terms of Service');
});

test('страница Privacy открывается', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('h1').last()).toContainText('Privacy Policy');
});

test('страница регистрации открывается', async ({ page }) => {
  await page.goto('/client/register');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]').first()).toBeVisible();
});

test('страница входа открывается', async ({ page }) => {
  await page.goto('/client/sign-in');
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

// ─── Регистрация ────────────────────────────────────────────────────────────
test('кнопка регистрации заблокирована без чекбокса', async ({ page }) => {
  await page.goto('/client/register');
  const submitBtn = page.locator('button[type="submit"]');
  await expect(submitBtn).toBeDisabled();
});

test('кнопка регистрации активна после чекбокса', async ({ page }) => {
  await page.goto('/client/register');
  await page.locator('#agreedToTerms').check();
  const submitBtn = page.locator('button[type="submit"]');
  await expect(submitBtn).toBeEnabled();
});

test('ошибка при несовпадении паролей', async ({ page }) => {
  await page.goto('/client/register');
  await page.locator('#agreedToTerms').check();
  await page.fill('input[type="email"]', 'test@example.com');

  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.first().fill('Password123!');
  await passwordInputs.nth(1).fill('DifferentPassword!');

  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Passwords do not match.')).toBeVisible({ timeout: 5000 });
});

// ─── Ссылки на Terms/Privacy ─────────────────────────────────────────────────
test('ссылки Terms и Privacy есть на странице регистрации', async ({ page }) => {
  await page.goto('/client/register');
  await expect(page.locator('a[href="/terms"]')).toBeVisible();
  await expect(page.locator('a[href="/privacy"]')).toBeVisible();
});

// ─── 404 ────────────────────────────────────────────────────────────────────
test('несуществующая страница показывает 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist-12345');
  expect(response?.status()).toBe(404);
});
