import { test, expect } from '@playwright/test';

test.describe('моковые данные', () => {
  test('записать HAR-файл', async ({ page }) => {
    await page.routeFromHAR('./tests/mockData.har', {
      url: 'https://norma.ffapi.ru',
      update: false,
    });

    await page.goto('/');

    await expect(page.getByTestId('loading')).not.toBeVisible();

    await expect(page.getByTestId('ingredients')).toBeVisible();
  });

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/mockData.har', {
      url: 'https://norma.ffapi.ru/api/ingredients',
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

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal').locator('button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .locator('a')
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page.mouse.click(0, 0);

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('создание заказа', async ({ context, page }) => {
    await context.addCookies([
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

    await page.route('**/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            _id: '6b05bf9fd52992ca5ffe7592',
            number: 1273,
            name: 'Space краторный метеоритный бургер',
            ingredients: [
              {
                _id: '6acd6b8163765e371c0bd9eb',
                name: 'Краторная булка N-200i',
                type: 'bun',
                proteins: 80,
                fat: 24,
                carbohydrates: 53,
                calories: 420,
                price: 1255,
                image: 'https://norma.ffapi.ru/images/bun-02.png',
                image_mobile: 'https://norma.ffapi.ru/images/bun-02-mobile.png',
                image_large: 'https://norma.ffapi.ru/images/bun-02-large.png',
              },
              {
                _id: '6acd6b8163765e9acf0bd9ef',
                name: 'Говяжий метеорит (отбивная)',
                type: 'main',
                proteins: 800,
                fat: 800,
                carbohydrates: 300,
                calories: 2674,
                price: 3000,
                image: 'https://norma.ffapi.ru/images/meat-04.png',
                image_mobile: 'https://norma.ffapi.ru/images/meat-04-mobile.png',
                image_large: 'https://norma.ffapi.ru/images/meat-04-large.png',
              },
              {
                _id: '6acd6b8163765e331a0bd9f2',
                name: 'Соус фирменный Space Sauce',
                type: 'sauce',
                proteins: 50,
                fat: 22,
                carbohydrates: 11,
                calories: 14,
                price: 80,
                image: 'https://norma.ffapi.ru/images/sauce-04.png',
                image_mobile: 'https://norma.ffapi.ru/images/sauce-04-mobile.png',
                image_large: 'https://norma.ffapi.ru/images/sauce-04-large.png',
              },
              {
                _id: '6acd6b8163765e371c0bd9eb',
                name: 'Краторная булка N-200i',
                type: 'bun',
                proteins: 80,
                fat: 24,
                carbohydrates: 53,
                calories: 420,
                price: 1255,
                image: 'https://norma.ffapi.ru/images/bun-02.png',
                image_mobile: 'https://norma.ffapi.ru/images/bun-02-mobile.png',
                image_large: 'https://norma.ffapi.ru/images/bun-02-large.png',
              },
            ],
            owner: {
              name: 'User',
              email: 'test@example.com',
              createdAt: '2026-11-06T06:30:15.808Z',
              updatedAt: '2026-11-24T15:55:01.772Z',
            },
            status: 'done',
            createdAt: '2026-11-24T16:47:27.038Z',
            updatedAt: '2026-11-24T16:47:27.041Z',
            price: 5590,
          },
          name: 'Space краторный метеоритный бургер',
        }),
      });
    });

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
    await expect(page.getByText('1273')).toBeVisible();

    await page.getByTestId('modal').locator('button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
