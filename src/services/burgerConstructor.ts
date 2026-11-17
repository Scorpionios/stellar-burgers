import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

import { orderBurgerApi } from '@utils/burger-api';

import type { SerializedError, PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, TOrder, TConstructorState } from '@utils/types';

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

type ConstructorState = TConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: SerializedError | null;
};

const initialStateConstructor: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState: initialStateConstructor,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        state.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeBun: (state) => {
      state.bun = null;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const item = state.ingredients.splice(fromIndex, 1)[0];
      state.ingredients.splice(toIndex, 0, item);
    },
    resetOrder: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      });
  },
});

export const {
  addBun,
  removeBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetOrder,
} = constructorSlice.actions;
