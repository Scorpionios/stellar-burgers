import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const feed = {
    orders: useSelector((state) => state.feeds.orders),
    total: useSelector((state) => state.feeds.total),
    totalToday: useSelector((state) => state.feeds.totalToday),
    isLoading: useSelector((state) => state.feeds.isLoading),
    error: useSelector((state) => state.feeds.error),
  };

  const orders: TOrder[] = useSelector((state) => state.feeds.orders);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
