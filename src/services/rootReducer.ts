import { authSlice } from './auth';
import { constructorSlice } from './burgerConstructor';
import { feedSlice } from './feeds';
import { ingredientsSlice } from './ingredients';
import { ordersSlice } from './orders';

export const rootReducer = {
  ingredients: ingredientsSlice.reducer,
  feeds: feedSlice.reducer,
  auth: authSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  orders: ordersSlice.reducer,
};
