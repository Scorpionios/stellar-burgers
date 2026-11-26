import { fetchUserOrders } from '@/services/slices/orders';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.orders.orders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
