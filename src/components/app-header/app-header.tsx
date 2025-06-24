import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../storage/hooks';
import { userSelectors } from '../../storage/slices/user';

export const AppHeader: FC = () => {
  const user = useAppSelector(userSelectors.getUser);

  return <AppHeaderUI userName={user?.name || ''} />;
};
