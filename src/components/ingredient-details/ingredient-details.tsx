import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppDispatch } from '../../storage/hooks';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIngredients } from '../../storage/slices/ingredients';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
