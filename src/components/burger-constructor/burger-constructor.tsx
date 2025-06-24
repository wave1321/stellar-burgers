import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
  selectConstructorItems,
  clearBurger
} from '../../storage/slices/burger';
import { userSelectors } from '../../storage/slices/user';
import {
  clearOrder,
  createOrder,
  selectCurrentOrder,
  selectOrderLoading
} from '../../storage/slices/order';
import { useAppDispatch, useAppSelector } from '../../storage/hooks';
import { fetchFeeds } from '../../storage/slices/feed';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(userSelectors.getUser);

  const constructorItems = useAppSelector(selectConstructorItems);
  const orderRequest = useAppSelector(selectOrderLoading);
  const orderModalData = useAppSelector(selectCurrentOrder);

  const onOrderClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    try {
      const ingredientsIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(
          (item: { _id: string }) => item._id
        ),
        constructorItems.bun._id
      ];

      await dispatch(createOrder(ingredientsIds)).unwrap();
      dispatch(clearBurger());

      dispatch(fetchFeeds());
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  //return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
