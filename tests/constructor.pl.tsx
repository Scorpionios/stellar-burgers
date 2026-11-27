import { test, expect } from '@playwright/test';

test.describe('проверка сценария конструктора и модального окна', () => {
  test('обновить HAR-файл', async ({ page }) => {
    await page.routeFromHAR('./tests/mockData.har', {
      url: 'https://norma.ffapi.ru/api/**',
      update: false,
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'super-secret-auth-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    await page.route('**/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@example.com',
            name: 'User',
          },
        }),
      });
    });

    await page.goto('/');

    await expect(page.getByTestId('loading')).not.toBeVisible();
    await expect(page.getByTestId('ingredients')).toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Соус фирменный Space Sauce' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal').locator('button').click();
  });

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/mockData.har', {
      url: 'https://norma.ffapi.ru/api/**',
      update: false,
    });
    await page.goto('/');
    await expect(page.getByTestId('loading')).not.toBeVisible();
  });

  test('добавить булку, начинку и соус в конструктор', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Соус фирменный Space Sauce' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page.getByTestId('burgerConstructor').getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();
    await expect(
      page.getByTestId('burgerConstructor').getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();
    await expect(
      page.getByTestId('burgerConstructor').getByText('Говяжий метеорит (отбивная)')
    ).toBeVisible();
    await expect(
      page.getByTestId('burgerConstructor').getByText('Соус фирменный Space Sauce')
    ).toBeVisible();
  });

  test('открытие и закрытие модального окна', async ({ page }) => {
    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .locator('a')
      .click();

    await expect(
      page.getByTestId('modal').getByText('Краторная булка N-200i')
    ).toBeVisible();

    await page.getByTestId('modal').locator('button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' })
      .locator('a')
      .click();

    await expect(
      page.getByTestId('modal').getByText('Говяжий метеорит (отбивная)')
    ).toBeVisible();

    await page.mouse.click(0, 0);

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Соус фирменный Space Sauce' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('9110')).toBeVisible();
    await expect(
      page.getByTestId('burgerConstructor').getByText('Краторная булка N-200i')
    ).not.toBeVisible();
    await expect(
      page.getByTestId('burgerConstructor').getByText('Говяжий метеорит (отбивная)')
    ).not.toBeVisible();
    await expect(
      page.getByTestId('burgerConstructor').getByText('Соус фирменный Space Sauce')
    ).not.toBeVisible();

    await page.getByTestId('modal').locator('button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
