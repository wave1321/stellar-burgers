import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppDispatch, useAppSelector } from '../../storage/hooks';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../storage/slices/ingredients';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const ingredients = useAppSelector(selectIngredients);
  const ingredientData = ingredients.find(
    (item: { _id: string }) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
