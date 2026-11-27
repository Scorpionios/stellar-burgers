import { expect, test } from '@jest/globals';

import { constructorSlice, createOrder } from '../burgerConstructor';

const { reducer, actions } = constructorSlice;

const initialState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
};
const mockBun = {
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
};
const initialStateWithIngredients = {
  bun: null,
  ingredients: [
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
      id: '1',
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
      id: '2',
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
      id: '3',
    },
    {
      _id: '6acd6b8163765e757e0bd9f8',
      name: 'Мини-салат Экзо-Плантаго',
      type: 'main',
      proteins: 1,
      fat: 2,
      carbohydrates: 3,
      calories: 6,
      price: 4400,
      image: 'https://norma.ffapi.ru/images/salad.png',
      image_mobile: 'https://norma.ffapi.ru/images/salad-mobile.png',
      image_large: 'https://norma.ffapi.ru/images/salad-large.png',
      id: '4',
    },
  ],
  orderRequest: false,
  orderModalData: null,
  error: null,
};

describe('тесты синхронных экшенов', () => {
  test('добавление булки в конструктор', () => {
    const state = reducer(initialState, actions.addBun(mockBun));

    expect(state.bun).toEqual({
      ...mockBun,
      id: expect.any(String),
    });
  });

  test('удаление булки из конструктора', () => {
    const initialStateWithBun = {
      bun: {
        ...mockBun,
        id: '1',
      },
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null,
    };

    const state = reducer(initialStateWithBun, actions.removeBun());

    expect(state).toEqual(initialState);
  });

  test('добавление ингредиента в конструктор', () => {
    const mockIngredient = {
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
    };

    const state = reducer(initialState, actions.addIngredient(mockIngredient));

    expect(state.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String),
    });
  });

  test('перемещение ингредиента в конструкторе', () => {
    const state = reducer(
      initialStateWithIngredients,
      actions.moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
    expect(state.ingredients[2].id).toBe('3');
    expect(state.ingredients[3].id).toBe('4');
  });

  test('удаление ингредиента из конструктора', () => {
    const state = reducer(initialStateWithIngredients, actions.removeIngredient('3'));

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0].id).toBe('1');
    expect(state.ingredients[1].id).toBe('2');
    expect(state.ingredients[2].id).toBe('4');
  });

  test('resetOrder: сбрасывает orderModalData', () => {
    const initialState = {
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: {
        _id: '6b0838dfd52992ca5ffe765a',
        name: 'Space краторный метеоритный бургер',
        id: '1',
        number: 1323,
        ingredients: ['1', '2', '1'],
        createdAt: '2026-11-24T16:47:27.038Z',
        updatedAt: '2026-11-26T13:49:19.199Z',
        status: 'done',
      },
      error: null,
    };

    const state = reducer(initialState, actions.resetOrder());

    expect(state.orderModalData).toBeNull();
  });
});

describe('тесты асинхронных экшенов', () => {
  test('экшен, несуществующий в приложении', () => {
    const nextState = reducer(undefined, { type: 'UNKNOWN' });
    expect(nextState).toEqual(initialState);
  });

  test('pending', () => {
    const state = reducer(initialState, createOrder.pending('1', []));

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  test('fulfilled', () => {
    const mockOrder = {
      _id: '6b0838dfd52992ca5ffe765a',
      name: 'Space краторный метеоритный бургер',
      id: '1',
      number: 1323,
      ingredients: ['1', '2', '1'],
      createdAt: '2026-11-24T16:47:27.038Z',
      updatedAt: '2026-11-26T13:49:19.199Z',
      status: 'done',
    };

    const initialStateFulfilled = {
      ...initialStateWithIngredients,
      bun: {
        ...mockBun,
        id: '1',
      },
    };

    const state = reducer(
      initialStateFulfilled,
      createOrder.fulfilled(mockOrder, '1', [])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.error).toBeNull();
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('rejected', () => {
    const state = reducer(
      initialState,
      createOrder.rejected(Error('Network error'), '1', [])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeTruthy();
  });
});
