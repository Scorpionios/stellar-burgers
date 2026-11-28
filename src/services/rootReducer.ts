import { authSlice } from './slices/auth';
import { constructorSlice } from './slices/burgerConstructor';
import { feedSlice } from './slices/feeds';
import { ingredientsSlice } from './slices/ingredients';
import { ordersSlice } from './slices/orders';

export const rootReducer = {
  ingredients: ingredientsSlice.reducer,
  feeds: feedSlice.reducer,
  auth: authSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  orders: ordersSlice.reducer,
};
