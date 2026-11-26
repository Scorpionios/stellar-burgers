import { expect, test } from '@jest/globals';

import { ingredientsSlice, fetchIngredients } from '../ingredients';

const { reducer } = ingredientsSlice;

describe('тесты экшенов ингредиентов', () => {
  const initialStateIngredients = {
    items: [],
    loading: false,
    error: null,
  };

  test('экшен, несуществующий в приложении', () => {
    const nextState = reducer(undefined, { type: 'UNKNOWN' });
    expect(nextState).toEqual(initialStateIngredients);
  });

  test('pending', () => {
    const state = reducer(
      initialStateIngredients,
      fetchIngredients.pending('1', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.items).toEqual([]);
    expect(state.error).toBeNull();
  });

  test('fulfilled', () => {
    const ingredients = [
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
    ];
    const state = reducer(
      initialStateIngredients,
      fetchIngredients.fulfilled(ingredients, '1', undefined)
    );
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(ingredients);
  });

  test('rejected', () => {
    const state = reducer(
      initialStateIngredients,
      fetchIngredients.rejected(Error(), '1', undefined)
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });
});
