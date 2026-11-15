import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchFeed } from '@services/rootReducer';
import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feeds.orders);
  console.log(number);

  useEffect(() => {
    if (!number) {
      void dispatch(fetchFeed());
    }
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
