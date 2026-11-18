import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi, getOrderByNumberApi } from '@utils/burger-api';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TOrder } from '@utils/types';

export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

type OrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialStateOrders: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialStateOrders,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});
