import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getIngredientsApi,
  getFeedsApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  getUserApi,
  updateUserApi,
  getOrdersApi,
  getOrderByNumberApi,
} from '@utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '@utils/cookie';

import type { SerializedError, PayloadAction } from '@reduxjs/toolkit';
import type {
  TIngredient,
  TFeedState,
  TUser,
  TOrder,
  TConstructorState,
} from '@utils/types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => await getIngredientsApi()
);

export const fetchFeed = createAsyncThunk(
  'feeds/fetch',
  async () => await getFeedsApi()
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (data: { email: string; name: string; password: string }) => {
    const response = await registerUserApi(data);
    return response;
  }
);

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => await loginUserApi(data)
);

export const logoutUserThunk = createAsyncThunk('auth/logout', async () => {
  const response = await logoutApi();
  return response;
});

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const getUserInfoThunk = createAsyncThunk('auth/info', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

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

export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async () => {
  const accessToken = getCookie('accessToken');
  if (!accessToken) return null;
  try {
    const response = await getUserApi();
    if (response.success) {
      return response.user;
    }
  } catch {
    localStorage.removeItem('refreshToken');
    setCookie('accessToken', '');
  }
  return null;
});

type AuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: SerializedError | null;
};

type TBase = {
  loading: boolean;
  error: SerializedError | null;
};

type IngredientsState = TBase & {
  items: TIngredient[];
};

type ConstructorState = TConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: SerializedError | null;
};

type OrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialStateConstructor: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
};

const initialStateAuth: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const initialStateIngredients: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

const initialStateFeed: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

const initialStateOrders: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const ConstructorSlice = createSlice({
  name: 'constructor',
  initialState: initialStateConstructor,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = {
        ...action.payload,
        id: Math.random().toString(36).slice(2),
      };
    },
    removeBun: (state) => {
      state.bun = null;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({
        ...action.payload,
        id: Math.random().toString(36).slice(2),
      });
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
} = ConstructorSlice.actions;

const AuthSlice = createSlice({
  name: 'auth',
  initialState: initialStateAuth,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(getUserInfoThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      });
  },
});

const FeedSlice = createSlice({
  name: 'feeds',
  initialState: initialStateFeed,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

const IngredientsSlice = createSlice({
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

const OrdersSlice = createSlice({
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

export const rootReducer = {
  ingredients: IngredientsSlice.reducer,
  feeds: FeedSlice.reducer,
  auth: AuthSlice.reducer,
  burgerConstructor: ConstructorSlice.reducer,
  orders: OrdersSlice.reducer,
};
