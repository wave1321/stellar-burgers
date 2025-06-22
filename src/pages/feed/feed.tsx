import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../storage/hooks';
import {
  fetchFeeds,
  selectFeedLoading,
  selectFeedOrders
} from '../../storage/slices/feed';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} loading={loading} />
  );
};
