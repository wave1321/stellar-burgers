import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { moveIngredient, removeIngredient } from '../../storage/slices/burger';
import { useAppDispatch } from '../../storage/hooks';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, ...rest }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          moveIngredient({
            fromIndex: index,
            toIndex: index + 1
          })
        );
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          moveIngredient({
            fromIndex: index,
            toIndex: index - 1
          })
        );
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
        {...rest}
      />
    );
  }
);
