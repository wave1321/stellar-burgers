import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../storage/slices/user';

export const AppHeader: FC = () => {
  const user = useSelector(userSelectors.getUser);

  return <AppHeaderUI userName={user?.name || ''} />;
};
