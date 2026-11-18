import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@utils/burger-api';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

type ingredientsState = {
  loading: boolean;
  error: SerializedError | null;
  items: TIngredient[];
};

const initialStateIngredients: ingredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredient',
  initialState: initialStateIngredients,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});
